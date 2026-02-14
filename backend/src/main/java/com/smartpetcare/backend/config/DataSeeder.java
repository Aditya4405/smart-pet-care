package com.smartpetcare.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // use the EXACT email from your database Row 5
        String adminEmail = "adityaprajapati4405@gmail.com"; 

        // 1. Check if user exists
        if (userRepository.existsByEmail(adminEmail)) {
            System.out.println("ℹ️ Admin account already exists. Skipping creation.");
            return;
        }

        try {
            // 2. Create only if not exists
            User admin = new User();
            admin.setFirstName("Super");
            admin.setLastName("Admin");
            admin.setEmail(adminEmail);
            admin.setPassword("Aditya#4405"); 
            admin.setRole("ADMIN");
            admin.setStatus("APPROVED");
            
            userRepository.save(admin);
            System.out.println("✅ ADMIN ACCOUNT CREATED SUCCESSFULLY");
        } catch (Exception e) {
            // 3. Catch any duplicate errors so server doesn't crash
            System.out.println("⚠️ Admin creation skipped: " + e.getMessage());
        }
    }
}