package com.smartpetcare.backend.service;

import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentCleanupService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    /**
     * Runs every night at midnight to move past appointments to COMPLETED status.
     * Cron expression: "0 0 0 * * ?" (Sec Min Hour Day Month Weekday)
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupPastAppointments() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // 1. Fetch all appointments that are still 'SCHEDULED'
        List<Appointment> allScheduled = appointmentRepository.findAll().stream()
                .filter(a -> "SCHEDULED".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());

        for (Appointment appt : allScheduled) {
            try {
                LocalDate apptDate = LocalDate.parse(appt.getAppointmentDate(), formatter);
                
                // 2. If the appointment date is before today, it has passed
                if (apptDate.isBefore(today)) {
                    appt.setStatus("COMPLETED");
                    appointmentRepository.save(appt);
                    System.out.println("Auto-completed Appointment ID: " + appt.getId());
                }
            } catch (Exception e) {
                System.err.println("Error parsing date for appt " + appt.getId() + ": " + e.getMessage());
            }
        }
    }
}