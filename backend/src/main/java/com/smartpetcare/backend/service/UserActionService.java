package com.smartpetcare.backend.service;

import com.smartpetcare.backend.dto.ReportRequestDTO;
import com.smartpetcare.backend.dto.TicketRequestDTO;
import com.smartpetcare.backend.entity.Report;
import com.smartpetcare.backend.entity.SupportTicket;
import com.smartpetcare.backend.repository.ReportRepository;
import com.smartpetcare.backend.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserActionService {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private AuditLogService auditLogService;

    public void createTicket(TicketRequestDTO dto, String ipAddress) {
        SupportTicket ticket = new SupportTicket();
        ticket.setUserName(dto.getUserName());
        ticket.setUserRole(dto.getUserRole());
        ticket.setIssue(dto.getIssue());
        ticket.setPriority(dto.getPriority());
        ticket.setStatus("OPEN");

        supportTicketRepository.save(ticket);

        // Automatically log this system event!
        auditLogService.logAction("Support Ticket Created: " + dto.getPriority(), dto.getUserName(), ipAddress, "INFO");
    }

    public void createReport(ReportRequestDTO dto, String ipAddress) {
        Report report = new Report();
        report.setTarget(dto.getTarget());
        report.setReason(dto.getReason());
        report.setSeverity(dto.getSeverity());
        report.setStatus("OPEN");

        reportRepository.save(report);

        // Automatically log this high-priority event!
        auditLogService.logAction("Moderation Report Filed against " + dto.getTarget(), "System User", ipAddress, "WARNING");
    }
}