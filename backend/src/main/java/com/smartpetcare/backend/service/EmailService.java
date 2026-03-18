package com.smartpetcare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // ==============================
    // 🔹 COMMON EMAIL METHOD (NEW)
    // ==============================
    private void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    // ==============================
    // 🔹 1. APPOINTMENT CONFIRMATION
    // ==============================
    public void sendAppointmentConfirmation(String toEmail, String ownerName, String petName, String vetName, String date, String time) {

        String subject = "Appointment Confirmed for " + petName + " 🐾";

        String body =
                "Hello " + ownerName + ",\n\n"
                        + "Your appointment payment was successful! Your visit is fully confirmed.\n\n"
                        + "Details:\n"
                        + "Patient: " + petName + "\n"
                        + "Doctor: Dr. " + vetName + "\n"
                        + "Date: " + date + "\n"
                        + "Time: " + time + "\n\n"
                        + "We look forward to seeing you and " + petName + "!\n\n"
                        + "Best regards,\nSmart Pet Care Team";

        sendEmail(toEmail, subject, body);
    }

    // ==============================
    // 🔹 2. PAYMENT REQUIRED EMAIL
    // ==============================
    public void sendPaymentRequiredEmail(String toEmail, String ownerName, String petName, String vetName, String date, String time, Integer amount) {

        String subject = "Action Required: Complete Payment for " + petName + "'s Appointment 🐾";

        String body =
                "Hello " + ownerName + ",\n\n"
                        + "Great news! Dr. " + vetName + " has reviewed and ACCEPTED your appointment request for " + petName + ".\n\n"
                        + "Appointment Details:\n"
                        + "Date: " + date + "\n"
                        + "Time: " + time + "\n"
                        + "Amount Due: ₹" + amount + "\n\n"
                        + "To officially confirm your slot, please log in to your SmartPetCare dashboard and complete the payment.\n\n"
                        + "Note: Your appointment will not be fully scheduled until the payment is received.\n\n"
                        + "Thank you,\nSmart Pet Care Team";

        sendEmail(toEmail, subject, body);
    }

    // ==============================
    // 🔹 3. REMINDER EMAIL
    // ==============================
    public void sendAppointmentReminder(String toEmail, String ownerName, String petName, String date, String time) {

        String subject = "Reminder: Upcoming Appointment for " + petName + " 🐾";

        String body =
                "Hello " + ownerName + ",\n\n"
                        + "This is a friendly reminder that you have an appointment scheduled for tomorrow.\n\n"
                        + "Patient: " + petName + "\n"
                        + "Date: " + date + "\n"
                        + "Time: " + time + "\n\n"
                        + "Please ensure you arrive 5 minutes early.\n\n"
                        + "Best regards,\nSmart Pet Care Team";

        sendEmail(toEmail, subject, body);
    }

    // ==============================
    // 🔹 4. PASSWORD RESET EMAIL (NEW)
    // ==============================
    public void sendPasswordResetEmail(String toEmail, String resetLink) {

        String subject = "Reset Your Password - Smart Pet Care";

        String body =
                "Hello,\n\n"
                        + "We received a request to reset your password.\n\n"
                        + "Click the link below to reset your password:\n\n"
                        + resetLink
                        + "\n\nThis link will expire in 15 minutes.\n\n"
                        + "If you did not request this, you can safely ignore this email.\n\n"
                        + "Regards,\nSmart Pet Care Team";

        sendEmail(toEmail, subject, body);
    }
}