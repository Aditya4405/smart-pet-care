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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows your React frontend to talk to this backend
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

    // --- DASHBOARD ---
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // --- APPOINTMENTS & FINANCIALS ---
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        // Fetches all appointments for the Admin Ledger and Booking views
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    // --- USER MANAGEMENT ---
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/vets")
    public ResponseEntity<List<User>> getAllVets() {
        return ResponseEntity.ok(adminService.getAllVets());
    }

    // --- MODERATION ACTIONS (Users & Vets) ---
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String action = payload.get("action");
        adminService.updateUserStatus(id, action);
        return ResponseEntity.ok().body(Map.of("message", "Status updated successfully", "userId", id));
    }

    // --- SUPPORT ENDPOINTS ---
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

    // --- MODERATION REPORTS ENDPOINTS ---
    @GetMapping("/moderation/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @DeleteMapping("/moderation/reports/{id}")
    public ResponseEntity<?> dismissReport(@PathVariable Long id) {
        reportRepository.deleteById(id);
        return ResponseEntity.ok().body(Map.of("message", "Report Dismissed"));
    }
    
 // --- AUDIT LOGS ENDPOINT ---
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }
}