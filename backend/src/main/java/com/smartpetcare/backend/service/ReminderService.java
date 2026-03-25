package com.smartpetcare.backend.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.repository.AppointmentRepository;

@Service
public class ReminderService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    // This cron expression means: Run every day at 8:00 AM.
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDailyReminders() {
        System.out.println("Running daily appointment reminder check...");

        // 1. Calculate tomorrow's date in YYYY-MM-DD format (matches your frontend format)
        String tomorrow = LocalDate.now().plusDays(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        
        // 2. Fetch all appointments scheduled for tomorrow
        List<Appointment> upcomingAppts = appointmentRepository.findByStatusAndAppointmentDate("SCHEDULED", tomorrow);
        
        System.out.println("Found " + upcomingAppts.size() + " appointments for tomorrow.");

        // 3. Loop through them and send the email
        for (Appointment appt : upcomingAppts) {
            try {
                emailService.sendAppointmentReminder(
                    appt.getOwner().getEmail(),
                    appt.getOwner().getFirstName(),
                    appt.getPet().getName(),
                    appt.getAppointmentDate(),
                    appt.getAppointmentTime()
                );
            } catch (Exception e) {
                System.err.println("Could not send reminder to " + appt.getOwner().getEmail());
            }
        }
    }
}