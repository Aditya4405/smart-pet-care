package com.smartpetcare.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.dto.LoginResponseDTO;
import com.smartpetcare.backend.repository.UserRepository;
import com.smartpetcare.backend.security.JwtUtil; // IMPORTING OUR NEW JWT UTILITY

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; // INJECTING JWT UTILITY

    // --- REGISTER USER ---
    public User registerUser(User user) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // 2. Set Status based on Role
        if ("VET".equalsIgnoreCase(user.getRole())) {
            user.setStatus("PENDING"); 
            System.out.println("NOTIFICATION: New Vet " + user.getEmail() + " registered. Status: PENDING");
        } else {
            user.setStatus("APPROVED");
        }

        // 3. Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
    
    // --- LOGIN USER ---
    public LoginResponseDTO loginUser(String email, String password) {
        // 1. Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check password securely
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        // 3. Check Status
        if ("PENDING".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Account is pending Admin Approval. Please wait.");
        }
        if ("REJECTED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Your account was rejected by Admin.");
        }

        // 4. GENERATE JWT TOKEN
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // 5. Build DTO and attach token
        LoginResponseDTO response = new LoginResponseDTO(user);
        response.setToken(token); // Put the token inside the response body
        
        return response;
    }

    // --- ADMIN: GET PENDING VETS ---
    public List<User> getPendingVets() {
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
    public List<User> getApprovedVets() {
        return userRepository.findAll().stream()
                .filter(u -> "VET".equals(u.getRole()) && "APPROVED".equals(u.getStatus()))
                .collect(Collectors.toList());
    }
}