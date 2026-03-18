package com.smartpetcare.backend.controller;

import com.smartpetcare.backend.entity.PasswordResetToken;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.PasswordResetTokenRepository;
import com.smartpetcare.backend.repository.UserRepository;
import com.smartpetcare.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.smartpetcare.backend.dto.ResetRequest;
import com.smartpetcare.backend.dto.ForgotRequest;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotRequest request) {

        String email = request.getEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete old tokens
        tokenRepository.deleteByUserId(user.getId());

        // Generate token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken(
                token,
                user,
                LocalDateTime.now().plusMinutes(15)
        );

        tokenRepository.save(resetToken);

        // Create reset link
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return "Password reset link sent to email";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetRequest request) {
        PasswordResetToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        tokenRepository.delete(token);

        return "Password reset successful";
    }
}