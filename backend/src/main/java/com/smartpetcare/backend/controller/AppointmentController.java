package com.smartpetcare.backend.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.entity.Pet;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.AppointmentRepository;
import com.smartpetcare.backend.repository.PetRepository;
import com.smartpetcare.backend.repository.UserRepository;
import com.smartpetcare.backend.service.EmailService;
import com.smartpetcare.backend.service.FileService;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private FileService fileService;
    @Autowired
    private EmailService emailService;

    // --- 1. BOOK APPOINTMENT (Starts as PENDING) ---
    @PostMapping(value = "/book", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bookAppointment(
            @RequestPart("appointmentData") String appointmentJson,
            @RequestPart(value = "medicalReport", required = false) MultipartFile medicalReport
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> payload = mapper.readValue(appointmentJson, Map.class);

            Long ownerId = Long.valueOf(payload.get("ownerId").toString());
            Long vetId = Long.valueOf(payload.get("vetId").toString());
            Long petId = Long.valueOf(payload.get("petId").toString());

            User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));
            User vet = userRepository.findById(vetId).orElseThrow(() -> new RuntimeException("Vet not found"));
            Pet pet = petRepository.findById(petId).orElseThrow(() -> new RuntimeException("Pet not found"));

            Appointment appointment = new Appointment();
            appointment.setOwner(owner);
            appointment.setVet(vet);
            appointment.setPet(pet);
            appointment.setAppointmentDate((String) payload.get("appointmentDate"));
            appointment.setAppointmentTime((String) payload.get("appointmentTime"));
            appointment.setVisitType((String) payload.get("visitType"));
            appointment.setSymptoms((String) payload.get("symptoms"));
            appointment.setAmountPaid(Integer.valueOf(payload.get("amountPaid").toString()));
            
            // Starts as PENDING for Vet to review
            appointment.setStatus("PENDING"); 
            appointment.setPaymentStatus("PENDING");

            if (medicalReport != null && !medicalReport.isEmpty()) {
                String fileName = fileService.saveFile(medicalReport);
                appointment.setMedicalReportUrl(fileName);
            }

            Appointment saved = appointmentRepository.save(appointment);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to book appointment: " + e.getMessage());
        }
    }

    // --- 2. VET ACCEPTS OR REJECTS ---
    @PutMapping("/{id}/vet-action")
    public ResponseEntity<?> vetAction(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            String action = payload.get("action"); 
            
            if ("ACCEPT".equalsIgnoreCase(action)) {
                appointment.setStatus("ACCEPTED");
                
                // SEND PAYMENT REQUIRED EMAIL TO OWNER
                try {
                    emailService.sendPaymentRequiredEmail(
                        appointment.getOwner().getEmail(), 
                        appointment.getOwner().getFirstName(), 
                        appointment.getPet().getName(), 
                        appointment.getVet().getLastName(), 
                        appointment.getAppointmentDate(), 
                        appointment.getAppointmentTime(),
                        appointment.getAmountPaid()
                    );
                } catch (Exception e) {
                    System.out.println("Payment reminder email failed (but status updated): " + e.getMessage());
                }
                
            } else if ("REJECT".equalsIgnoreCase(action)) {
                appointment.setStatus("REJECTED");
                appointment.setPaymentStatus("REFUNDED");
            }
            
            return ResponseEntity.ok(appointmentRepository.save(appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }

    // --- 3. OWNER PAYS (Changes to SCHEDULED and Sends Confirmation Email) ---
    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payAppointment(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            appointment.setStatus("SCHEDULED");
            appointment.setPaymentStatus("PAID");
            Appointment saved = appointmentRepository.save(appointment);
            
            // Send Final Email Confirmation NOW
            try {
                emailService.sendAppointmentConfirmation(
                    saved.getOwner().getEmail(), saved.getOwner().getFirstName(), saved.getPet().getName(), 
                    saved.getVet().getLastName(), saved.getAppointmentDate(), saved.getAppointmentTime()
                );
            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
            }

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment failed: " + e.getMessage());
        }
    }

    // --- 4. CANCEL APPOINTMENT (With 24-Hour Check) ---
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            String role = payload.get("role"); 
            
            if ("OWNER".equalsIgnoreCase(role)) {
                LocalDate apptDate = LocalDate.parse(appointment.getAppointmentDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                LocalDate tomorrow = LocalDate.now().plusDays(1);
                
                if (apptDate.isBefore(tomorrow) || apptDate.isEqual(tomorrow)) {
                    return ResponseEntity.badRequest().body("Cannot cancel within 24 hours of the appointment time.");
                }
                
                appointment.setStatus("CANCELLED");
                if ("PAID".equals(appointment.getPaymentStatus())) {
                    appointment.setPaymentStatus("REFUNDED");
                }
            } 
            else if ("VET".equalsIgnoreCase(role)) {
                appointment.setStatus("CANCELLED_BY_VET");
                if ("PAID".equals(appointment.getPaymentStatus())) {
                    appointment.setPaymentStatus("REFUNDED");
                }
            }
            
            return ResponseEntity.ok(appointmentRepository.save(appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Cancellation failed: " + e.getMessage());
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Appointment>> getOwnerAppointments(@PathVariable Long ownerId) {
        return ResponseEntity.ok(appointmentRepository.findByOwnerId(ownerId));
    }

    @GetMapping("/vet/{vetId}")
    public ResponseEntity<List<Appointment>> getVetAppointments(@PathVariable Long vetId) {
        return ResponseEntity.ok(appointmentRepository.findByVetId(vetId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
            appointment.setStatus("COMPLETED");
            
            if (payload.containsKey("clinicalNotes")) appointment.setClinicalNotes((String) payload.get("clinicalNotes"));
            if (payload.containsKey("enableFollowUp")) appointment.setFollowUpEnabled((Boolean) payload.get("enableFollowUp"));
            if (payload.containsKey("days") && payload.get("days") != null && !payload.get("days").toString().isEmpty()) {
                appointment.setFollowUpDays(Integer.valueOf(payload.get("days").toString()));
            }
            
            return ResponseEntity.ok(appointmentRepository.save(appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed: " + e.getMessage());
        }
    }
}