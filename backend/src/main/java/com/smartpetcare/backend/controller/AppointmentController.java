package com.smartpetcare.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.entity.Pet;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.AppointmentRepository;
import com.smartpetcare.backend.repository.PetRepository;
import com.smartpetcare.backend.repository.UserRepository;
import com.smartpetcare.backend.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

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
    private FileService fileService; // Added FileService

    // --- CREATE NEW APPOINTMENT (With File Upload Support) ---
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
            appointment.setStatus("SCHEDULED");

            // Handle the File Upload
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

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Appointment>> getOwnerAppointments(@PathVariable Long ownerId) {
        return ResponseEntity.ok(appointmentRepository.findByOwnerId(ownerId));
    }
 // --- GET APPOINTMENTS FOR VET ---
    @GetMapping("/vet/{vetId}")
    public ResponseEntity<List<Appointment>> getVetAppointments(@PathVariable Long vetId) {
        return ResponseEntity.ok(appointmentRepository.findByVetId(vetId));
    }
 // --- COMPLETE APPOINTMENT ---
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            // Update status
            appointment.setStatus("COMPLETED");
            
            // Save Vet's Notes and Follow-Up details
            if (payload.containsKey("clinicalNotes")) {
                appointment.setClinicalNotes((String) payload.get("clinicalNotes"));
            }
            if (payload.containsKey("enableFollowUp")) {
                appointment.setFollowUpEnabled((Boolean) payload.get("enableFollowUp"));
            }
            if (payload.containsKey("days") && payload.get("days") != null && !payload.get("days").toString().isEmpty()) {
                appointment.setFollowUpDays(Integer.valueOf(payload.get("days").toString()));
            }
            
            Appointment saved = appointmentRepository.save(appointment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to complete appointment: " + e.getMessage());
        }
    }
}