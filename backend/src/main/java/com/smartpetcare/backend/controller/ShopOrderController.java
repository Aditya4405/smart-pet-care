package com.smartpetcare.backend.controller;

import com.smartpetcare.backend.entity.ShopOrder;
import com.smartpetcare.backend.entity.PaymentTransaction; 
import com.smartpetcare.backend.repository.PaymentTransactionRepository; 
import com.smartpetcare.backend.service.ShopOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class ShopOrderController {

    @Autowired
    private ShopOrderService shopOrderService;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    // 1. Place a new Order (Users)
    @PostMapping("/checkout")
    public ResponseEntity<?> placeOrder(@RequestBody ShopOrder order) {
        try {
            ShopOrder savedOrder = shopOrderService.placeOrder(order);

            // --- RECORD IN CENTRAL LEDGER ---
            try {
                PaymentTransaction txn = new PaymentTransaction();
                String txnId = "MKT-TXN-" + savedOrder.getId() + "-" + System.currentTimeMillis();
                
                txn.setRazorpayPaymentId(txnId);
                txn.setRazorpayOrderId("MARKETPLACE_ORDER");
                
                int amount = savedOrder.getTotalAmount() != null ? savedOrder.getTotalAmount().intValue() : 0;
                txn.setAmount(amount);
                
                txn.setCurrency("INR");
                txn.setPaymentType("MARKETPLACE_ORDER");
                txn.setReferenceId(savedOrder.getId());
                txn.setStatus("SUCCESS");
                
                // FIXED: Removed the .getUser() call to fix the compile error
                txn.setUserEmail("Marketplace Customer");
                
                paymentTransactionRepository.save(txn);
            } catch (Exception ex) {
                System.err.println("Warning: Failed to save marketplace order to ledger: " + ex.getMessage());
            }
            // --------------------------------

            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 2. Get Orders for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShopOrder>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(shopOrderService.getUserOrders(userId));
    }

    // 3. Get ALL Orders (Admin Only)
    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<List<ShopOrder>> getAllOrders() {
        return ResponseEntity.ok(shopOrderService.getAllOrdersForAdmin());
    }

    // 4. Update Order Status (Admin Only - e.g., mark as "SHIPPED")
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<ShopOrder> updateOrderStatus(
            @PathVariable Long orderId, 
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(shopOrderService.updateOrderStatus(orderId, status));
    }

    // --- TEMPORARY DATA MIGRATION (BACKFILL) ENDPOINT FOR MARKETPLACE ---
    @GetMapping("/admin/sync-old-orders")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')")
    public ResponseEntity<?> syncOldOrders() {
        try {
            List<ShopOrder> allOrders = shopOrderService.getAllOrdersForAdmin();
            int count = 0;

            for (ShopOrder order : allOrders) {
                // Only sync orders that were NOT cancelled
                if (!"CANCELLED".equalsIgnoreCase(order.getStatus())) {
                    
                    String txnId = "LEGACY-MKT-TXN-" + order.getId();
                    
                    // Prevent duplicates
                    if (paymentTransactionRepository.findByRazorpayPaymentId(txnId) == null) {
                        PaymentTransaction txn = new PaymentTransaction();
                        txn.setRazorpayPaymentId(txnId);
                        txn.setRazorpayOrderId("SYNCED_MKT_ORDER");
                        
                        int amount = order.getTotalAmount() != null ? order.getTotalAmount().intValue() : 0;
                        txn.setAmount(amount);
                        
                        txn.setCurrency("INR");
                        txn.setPaymentType("MARKETPLACE_ORDER");
                        txn.setReferenceId(order.getId());
                        txn.setStatus("SUCCESS");
                        
                        // FIXED: Removed the .getUser() call here as well
                        txn.setUserEmail("Marketplace Customer");
                        
                        paymentTransactionRepository.save(txn);
                        count++;
                    }
                }
            }
            return ResponseEntity.ok(Map.of("message", "Successfully synced " + count + " old marketplace orders into the ledger!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Sync failed: " + e.getMessage());
        }
    }
}