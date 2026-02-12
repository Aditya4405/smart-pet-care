package com.smartpetcare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Method to register a new user
    public User registerUser(User user) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // 2. Set Status based on Role
        if ("VET".equalsIgnoreCase(user.getRole())) {
            user.setStatus("PENDING"); // Vets must wait for Admin
            System.out.println("NOTIFICATION: New Vet " + user.getEmail() + " registered. Status: PENDING");
        } else {
            user.setStatus("APPROVED"); // Regular users are auto-approved
        }

        // 3. Save the user
        return userRepository.save(user);
    }
    
    // Method to login a user
    public User loginUser(String email, String password) {
        // 1. Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check password
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // 3. Check Status (Block if Pending or Rejected)
        if ("PENDING".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Account is pending Admin Approval. Please wait.");
        }
        if ("REJECTED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Account was rejected by Admin.");
        }

        return user;
    }
}