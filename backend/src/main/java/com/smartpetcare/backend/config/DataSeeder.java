package com.smartpetcare.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject encoder

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "adityaprajapati4405@gmail.com"; 

        if (userRepository.existsByEmail(adminEmail)) {
            System.out.println("ℹ️ Admin account already exists. Skipping creation.");
            return;
        }

        try {
            User admin = new User();
            admin.setFirstName("Aditya");
            admin.setLastName("P");
            admin.setEmail(adminEmail);
            // Encode the password before saving
            admin.setPassword(passwordEncoder.encode("Aditya#4405")); 
            
            admin.setRole("ADMIN");
            admin.setStatus("APPROVED");
            
            userRepository.save(admin);
            System.out.println("✅ ADMIN ACCOUNT CREATED SUCCESSFULLY");
        } catch (Exception e) {
            System.out.println("⚠️ Admin creation skipped: " + e.getMessage());
        }
    }
}