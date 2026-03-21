package com.smartpetcare.backend.service;

import com.smartpetcare.backend.entity.AuditLog;
import com.smartpetcare.backend.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String action, String actor, String ipAddress, String severity) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setActor(actor);
        log.setIpAddress(ipAddress != null ? ipAddress : "Unknown IP");
        log.setSeverity(severity); // "INFO", "WARNING", "CRITICAL"
        
        auditLogRepository.save(log);
    }
}