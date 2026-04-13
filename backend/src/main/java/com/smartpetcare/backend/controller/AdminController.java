package com.smartpetcare.backend.controller;

import com.smartpetcare.backend.dto.DashboardStatsDTO;
import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.entity.AuditLog;
import com.smartpetcare.backend.entity.Report;
import com.smartpetcare.backend.entity.SupportTicket;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.AppointmentRepository;
import com.smartpetcare.backend.repository.AuditLogRepository;
import com.smartpetcare.backend.repository.ReportRepository;
import com.smartpetcare.backend.repository.SupportTicketRepository;
import com.smartpetcare.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN')") // <-- THIS FIXES THE 403 ERROR!
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private ReportRepository reportRepository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/vets")
    public ResponseEntity<List<User>> getAllVets() {
        return ResponseEntity.ok(adminService.getAllVets());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String action = payload.get("action");
        adminService.updateUserStatus(id, action);
        return ResponseEntity.ok().body(Map.of("message", "Status updated successfully", "userId", id));
    }

    @GetMapping("/support/tickets")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(supportTicketRepository.findAll());
    }

    @PutMapping("/support/tickets/{id}/resolve")
    public ResponseEntity<?> resolveTicket(@PathVariable Long id) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        
        ticket.setStatus("RESOLVED");
        supportTicketRepository.save(ticket);
        
        return ResponseEntity.ok().body(Map.of("message", "Ticket Resolved"));
    }

    @GetMapping("/moderation/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @DeleteMapping("/moderation/reports/{id}")
    public ResponseEntity<?> dismissReport(@PathVariable Long id) {
        reportRepository.deleteById(id);
        return ResponseEntity.ok().body(Map.of("message", "Report Dismissed"));
    }
    
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }
}