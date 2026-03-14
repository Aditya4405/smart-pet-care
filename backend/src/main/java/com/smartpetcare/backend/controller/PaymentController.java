package com.smartpetcare.backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.smartpetcare.backend.dto.PaymentRequest;
import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.entity.PaymentTransaction; 
import com.smartpetcare.backend.repository.AppointmentRepository;
import com.smartpetcare.backend.repository.PaymentTransactionRepository; 
import com.smartpetcare.backend.service.AuditLogService; 

import jakarta.servlet.http.HttpServletRequest; 
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.webhook.secret:your_default_secret}") // Add this to application.properties later
    private String webhookSecret;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private AuditLogService auditLogService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            int amount = Integer.parseInt(data.get("amount").toString());
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); 
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            Order order = client.orders.create(orderRequest);
            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating Razorpay order");
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentRequest payReq, HttpServletRequest request) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", payReq.getRazorpay_order_id());
            options.put("razorpay_payment_id", payReq.getRazorpay_payment_id());
            options.put("razorpay_signature", payReq.getRazorpay_signature());

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            if (isValid) {
                processSuccessfulPayment(payReq.getAppointmentId(), payReq.getRazorpay_payment_id(), payReq.getRazorpay_order_id(), request.getRemoteAddr());
                return ResponseEntity.ok(Map.of("status", "success"));
            } else {
                return ResponseEntity.status(400).body("Invalid Payment Signature");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Verification failed");
        }
    }

    // --- NEW: RAZORPAY WEBHOOK HANDLER ---
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody String payload, @RequestHeader("X-Razorpay-Signature") String signature, HttpServletRequest request) {
        try {
            // Verify if the request actually came from Razorpay
            boolean isValid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
            
            if (isValid) {
                JSONObject json = new JSONObject(payload);
                String event = json.getString("event");

                if ("payment.captured".equals(event)) {
                    JSONObject paymentEntity = json.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
                    String paymentId = paymentEntity.getString("id");
                    String orderId = paymentEntity.getString("order_id");
                    
                    // Note: In webhooks, you might need to find the appointment by order_id 
                    // if you stored it, or skip if already verified by frontend.
                    System.out.println("Webhook: Payment Captured " + paymentId);
                }
                return ResponseEntity.ok("Webhook Processed");
            }
            return ResponseEntity.status(400).body("Invalid Signature");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Webhook Error");
        }
    }

    // Refactored logic into a helper method so both Verify and Webhook can use it
    private void processSuccessfulPayment(Long appointmentId, String paymentId, String orderId, String ipAddress) {
        if (paymentTransactionRepository.findByRazorpayPaymentId(paymentId) != null) return;

        Appointment appt = appointmentRepository.findById(appointmentId).orElseThrow();
        appt.setStatus("SCHEDULED");
        appt.setTransactionId(paymentId);
        appointmentRepository.save(appt);

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setRazorpayPaymentId(paymentId);
        transaction.setRazorpayOrderId(orderId);
        transaction.setAmount(appt.getAmountPaid());
        transaction.setCurrency("INR");
        transaction.setPaymentType("APPOINTMENT");
        transaction.setReferenceId(appt.getId());
        transaction.setStatus("SUCCESS");
        
        String userEmail = appt.getOwner() != null ? appt.getOwner().getEmail() : "Unknown";
        transaction.setUserEmail(userEmail); 
        paymentTransactionRepository.save(transaction);

        auditLogService.logAction(
            "Payment Successful for Appointment APT-" + appt.getId() + " by " + userEmail, 
            "System", ipAddress, "INFO" 
        );
    }

    @PostMapping("/refund/{id}")
    public ResponseEntity<?> processRefund(@PathVariable Long id, HttpServletRequest request) { 
        try {
            PaymentTransaction txn = paymentTransactionRepository.findById(id).orElseThrow();
            if (!"SUCCESS".equalsIgnoreCase(txn.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only successful transactions can be refunded."));
            }

            String paymentId = txn.getRazorpayPaymentId();
            if (paymentId != null && paymentId.startsWith("pay_")) {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject refundRequest = new JSONObject();
                refundRequest.put("payment_id", paymentId);
                client.refunds.create(refundRequest); 
            }

            txn.setStatus("REFUNDED");
            paymentTransactionRepository.save(txn);

            if ("APPOINTMENT".equals(txn.getPaymentType())) {
                appointmentRepository.findById(txn.getReferenceId()).ifPresent(appt -> {
                    appt.setStatus("CANCELLED");
                    appt.setPaymentStatus("REFUNDED");
                    appointmentRepository.save(appt);
                });
            }

            auditLogService.logAction(
                "Refunded " + txn.getPaymentType() + " (TXN: " + txn.getRazorpayPaymentId() + ") to " + txn.getUserEmail(), 
                "System Admin", request.getRemoteAddr(), "CRITICAL" 
            );

            return ResponseEntity.ok(Map.of("message", "Refund processed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Refund failed: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllPayments() {
        return ResponseEntity.ok(paymentTransactionRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/sync-old-payments")
    public ResponseEntity<?> syncOldPayments() {
        try {
            java.util.List<Appointment> appointments = appointmentRepository.findAll();
            int count = 0;
            for (Appointment appt : appointments) {
                boolean isPaid = "PAID".equalsIgnoreCase(appt.getPaymentStatus()) || "SCHEDULED".equalsIgnoreCase(appt.getStatus()) || "COMPLETED".equalsIgnoreCase(appt.getStatus());
                if (isPaid && appt.getAmountPaid() != null && appt.getAmountPaid() > 0) {
                    String txnId = appt.getTransactionId() != null ? appt.getTransactionId() : "LEGACY-TXN-" + appt.getId();
                    if (paymentTransactionRepository.findByRazorpayPaymentId(txnId) == null) {
                        PaymentTransaction txn = new PaymentTransaction();
                        txn.setRazorpayPaymentId(txnId);
                        txn.setRazorpayOrderId("SYNCED_OLD_ORDER");
                        txn.setAmount(appt.getAmountPaid());
                        txn.setCurrency("INR");
                        txn.setPaymentType("APPOINTMENT");
                        txn.setReferenceId(appt.getId());
                        txn.setStatus("SUCCESS");
                        txn.setUserEmail(appt.getOwner() != null ? appt.getOwner().getEmail() : "Unknown");
                        paymentTransactionRepository.save(txn);
                        count++;
                    }
                }
            }
            return ResponseEntity.ok(java.util.Map.of("message", "Successfully synced " + count + " old appointments!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Sync failed: " + e.getMessage());
        }
    }
}