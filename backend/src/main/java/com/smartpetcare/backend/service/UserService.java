package com.smartpetcare.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // --- REGISTER USER ---
    public User registerUser(User user) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // 2. Set Status based on Role
        // Vets must wait for Admin Approval. Normal users are approved immediately.
        if ("VET".equalsIgnoreCase(user.getRole())) {
            user.setStatus("PENDING"); 
            System.out.println("NOTIFICATION: New Vet " + user.getEmail() + " registered. Status: PENDING");
        } else {
            user.setStatus("APPROVED");
        }

        // 3. Save the user
        return userRepository.save(user);
    }
    
    // --- LOGIN USER ---
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
            throw new RuntimeException("Your account was rejected by Admin.");
        }

        return user;
    }

    // --- ADMIN: GET PENDING VETS ---
    public List<User> getPendingVets() {
        // Filters all users to find only those who are VETs and have status PENDING
        return userRepository.findAll().stream()
                .filter(u -> "VET".equals(u.getRole()) && "PENDING".equals(u.getStatus()))
                .collect(Collectors.toList());
    }

    // --- ADMIN: APPROVE/REJECT USER ---
    public User updateUserStatus(Long userId, String newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(newStatus);
        return userRepository.save(user);
    }
}