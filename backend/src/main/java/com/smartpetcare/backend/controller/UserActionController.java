package com.smartpetcare.backend.controller;

import com.smartpetcare.backend.dto.ReportRequestDTO;
import com.smartpetcare.backend.dto.TicketRequestDTO;
import com.smartpetcare.backend.service.UserActionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/actions")
@CrossOrigin(origins = "http://localhost:5173") 
public class UserActionController {

    @Autowired
    private UserActionService userActionService;

    // Standard users call this to submit a helpdesk ticket
    @PostMapping("/support/ticket")
    public ResponseEntity<?> submitTicket(@RequestBody TicketRequestDTO requestDTO, HttpServletRequest request) {
        // Extract IP address for the audit log
        String ipAddress = request.getRemoteAddr();
        
        userActionService.createTicket(requestDTO, ipAddress);
        return ResponseEntity.ok().body(Map.of("message", "Ticket submitted successfully. Our team will review it shortly."));
    }

    // Standard users call this to report a scammer/bad actor
    @PostMapping("/moderation/report")
    public ResponseEntity<?> submitReport(@RequestBody ReportRequestDTO requestDTO, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        
        userActionService.createReport(requestDTO, ipAddress);
        return ResponseEntity.ok().body(Map.of("message", "Report filed successfully. Thank you for keeping the community safe."));
    }
}