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
import com.smartpetcare.backend.service.AuditLogService;
import com.smartpetcare.backend.service.GoogleCalendarService;
import com.smartpetcare.backend.service.PrescriptionService;

import jakarta.servlet.http.HttpServletRequest;

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
    private PrescriptionService prescriptionService;
    
    @Autowired
    private FileService fileService;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditLogService auditLogService; 

    @Autowired
    private GoogleCalendarService googleCalendarService;

    @PostMapping(value = "/book", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bookAppointment(
            @RequestPart("appointmentData") String appointmentJson,
            @RequestPart(value = "medicalReport", required = false) MultipartFile medicalReport,
            HttpServletRequest request 
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
            
            appointment.setStatus("PENDING"); 
            appointment.setPaymentStatus("PENDING");

            if (medicalReport != null && !medicalReport.isEmpty()) {
                String fileName = fileService.saveFile(medicalReport);
                appointment.setMedicalReportUrl(fileName);
            }

            if ("VIDEO".equalsIgnoreCase(appointment.getVisitType())) {
                try {
                    String meetLink = googleCalendarService.createMeetLink(
                        pet.getName(), 
                        vet.getLastName(), 
                        appointment.getAppointmentDate(), 
                        appointment.getAppointmentTime()
                    );
                    
                    if (meetLink == null || meetLink.isEmpty()) {
                        System.err.println("WARNING: Google API returned a null link. Using a fallback link.");
                        meetLink = "https://meet.google.com/new"; 
                    }
                    
                    appointment.setMeetLink(meetLink);
                } catch (Exception e) {
                    System.err.println("CRITICAL ERROR generating Meet link: " + e.getMessage());
                    appointment.setMeetLink("https://meet.google.com/new"); 
                }
            }

            Appointment saved = appointmentRepository.save(appointment);

            String ipAddress = request.getRemoteAddr();
            auditLogService.logAction(
                "New Booking Request (Pending Vet Approval): APT-" + saved.getId(), 
                owner.getFirstName() + " (Owner)", 
                ipAddress, 
                "INFO"
            );

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to book appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/vet-action")
    public ResponseEntity<?> vetAction(@PathVariable Long id, @RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            String action = payload.get("action"); 
            
            if ("ACCEPT".equalsIgnoreCase(action)) {
                appointment.setStatus("ACCEPTED");
                
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
            
            Appointment saved = appointmentRepository.save(appointment);

            auditLogService.logAction(
                "Vet " + action + "ED Appointment APT-" + saved.getId(), 
                "Dr. " + saved.getVet().getLastName(), 
                request.getRemoteAddr(), 
                "INFO"
            );

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payAppointment(@PathVariable Long id, HttpServletRequest request) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            appointment.setStatus("SCHEDULED");
            appointment.setPaymentStatus("PAID");
            Appointment saved = appointmentRepository.save(appointment);
            
            try {
                emailService.sendAppointmentConfirmation(
                    saved.getOwner().getEmail(), saved.getOwner().getFirstName(), saved.getPet().getName(), 
                    saved.getVet().getLastName(), saved.getAppointmentDate(), saved.getAppointmentTime()
                );
            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
            }

            auditLogService.logAction(
                "Payment Processed: ₹" + saved.getAmountPaid() + " for APT-" + saved.getId(), 
                saved.getOwner().getFirstName() + " (Owner)", 
                request.getRemoteAddr(), 
                "WARNING" 
            );

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment failed: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, @RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            String role = payload.get("role"); 
            String actorName = role.equalsIgnoreCase("OWNER") ? appointment.getOwner().getFirstName() : "Dr. " + appointment.getVet().getLastName();
            
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
            
            Appointment saved = appointmentRepository.save(appointment);

            auditLogService.logAction(
                "Appointment APT-" + saved.getId() + " Cancelled", 
                actorName, 
                request.getRemoteAddr(), 
                "CRITICAL" 
            );

            return ResponseEntity.ok(saved);
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

    // --- FULLY UPDATED COMPLETE ENDPOINT ---
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Not found"));

            String notes = (String) payload.get("clinicalNotes");
            Boolean followUpEnabled = (Boolean) payload.get("followUpEnabled");
            
            // Handle parsing integer safely from JSON map
            Integer followUpDays = null;
            if (payload.get("followUpDays") != null) {
                followUpDays = Integer.parseInt(payload.get("followUpDays").toString());
            }

            // ✅ GENERATE DOCX FILE
            String fileName = prescriptionService.generateDoc(notes, id);

            // ✅ SAVE DATA IN DB
            appointment.setPrescriptionFileUrl(fileName);
            appointment.setClinicalNotes(notes);
            appointment.setFollowUpEnabled(followUpEnabled != null ? followUpEnabled : false);
            appointment.setFollowUpDays(followUpDays);
            appointment.setStatus("COMPLETED");

            return ResponseEntity.ok(appointmentRepository.save(appointment));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed: " + e.getMessage());
        }
    }
}