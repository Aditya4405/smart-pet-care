package com.smartpetcare.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Read admin credentials from environment variables
    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.existsByEmail(adminEmail)) {
            System.out.println("ℹ️ Admin account already exists. Skipping creation.");
            return;
        }

        try {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail(adminEmail);

            // Encode password from environment variable
            admin.setPassword(passwordEncoder.encode(adminPassword));

            admin.setRole("ADMIN");
            admin.setStatus("APPROVED");

            userRepository.save(admin);

            System.out.println("✅ ADMIN ACCOUNT CREATED SUCCESSFULLY");

        } catch (Exception e) {
            System.out.println("⚠️ Admin creation skipped: " + e.getMessage());
        }
    }
}