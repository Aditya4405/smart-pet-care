package com.smartpetcare.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import java.util.Optional;
import java.util.UUID;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.dto.LoginResponseDTO;
import com.smartpetcare.backend.repository.UserRepository;
import com.smartpetcare.backend.security.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${GOOGLE_CLIENT_ID}")
    private String googleClientId;

    // ==============================
    // 🔹 REGISTER USER
    // ==============================
    public User registerUser(User user) {

        // Validate Email
        if (user.getEmail() == null || !user.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new RuntimeException("Invalid email format!");
        }

        // Validate Phone
        if (user.getPhone() == null || !user.getPhone().matches("^\\d{10}$")) {
            throw new RuntimeException("Phone number must be exactly 10 digits!");
        }

        // 1. Check if email exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        if ("VET".equalsIgnoreCase(user.getRole()) && user.getLicenseNumber() != null && !user.getLicenseNumber().trim().isEmpty()) {
            if (userRepository.existsByLicenseNumber(user.getLicenseNumber())) {
                throw new RuntimeException("License number is already registered!");
            }
        }

        // 2. Set Status
        if ("VET".equalsIgnoreCase(user.getRole())) {
            user.setStatus("PENDING");
            System.out.println("NOTIFICATION: New Vet " + user.getEmail() + " registered. Status: PENDING");
        } else {
            user.setStatus("APPROVED");
        }

        // 3. Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // ==============================
    // 🔹 LOGIN USER (UPDATED FIX)
    // ==============================
    public LoginResponseDTO loginUser(String email, String password) {

        // 1. Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        String storedPassword = user.getPassword();

        // ==============================
        // 🔥 HANDLE OLD (PLAIN TEXT) PASSWORDS
        // ==============================
        if (!storedPassword.startsWith("$2a$")) {
            // Old password (plain text)

            if (!storedPassword.equals(password)) {
                throw new RuntimeException("Invalid credentials");
            }

            // 🔥 Auto-upgrade to BCrypt
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);

        } else {
            // BCrypt password
            if (!passwordEncoder.matches(password, storedPassword)) {
                throw new RuntimeException("Invalid credentials");
            }
        }

        // ==============================
        // 🔹 STATUS CHECKS
        // ==============================
        // Pending check removed so vets can log in to view status

        if ("REJECTED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Your account was rejected by Admin.");
        }

        if ("BANNED".equalsIgnoreCase(user.getStatus()) ||
            "SUSPENDED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Your account is restricted. Contact support.");
        }

        // ==============================
        // 🔹 GENERATE JWT
        // ==============================
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        LoginResponseDTO response = new LoginResponseDTO(user);
        response.setToken(token);

        return response;
    }

    // ==============================
    // 🔹 GOOGLE LOGIN
    // ==============================
    public LoginResponseDTO googleLogin(String idTokenString, String requestedRole) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
            .setAudience(Collections.singletonList(googleClientId))
            .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            
            // Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
                // Check status
                if ("BANNED".equalsIgnoreCase(user.getStatus()) || "SUSPENDED".equalsIgnoreCase(user.getStatus())) {
                    throw new RuntimeException("Account is restricted.");
                }
            } else {
                // Register new user
                user = new User();
                user.setEmail(email);
                user.setFirstName(firstName != null ? firstName : "User");
                user.setLastName(lastName != null ? lastName : "");
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random password
                user.setRole(requestedRole != null ? requestedRole.toUpperCase() : "USER");
                
                if ("VET".equalsIgnoreCase(user.getRole())) {
                    user.setStatus("PENDING");
                    user = userRepository.save(user);
                } else {
                    user.setStatus("APPROVED");
                    user = userRepository.save(user);
                }
            }
            // Pending check removed so vets can log in to view status

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            LoginResponseDTO response = new LoginResponseDTO(user);
            response.setToken(token);
            return response;

        } else {
            throw new RuntimeException("Invalid Google ID token.");
        }
    }

    // ==============================
    // 🔹 ADMIN: PENDING VETS
    // ==============================
    public List<User> getPendingVets() {
        return userRepository.findAll().stream()
                .filter(u -> "VET".equals(u.getRole()) && "PENDING".equals(u.getStatus()))
                .collect(Collectors.toList());
    }

    // ==============================
    // 🔹 ADMIN: UPDATE STATUS
    // ==============================
    public User updateUserStatus(Long userId, String newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(newStatus);
        return userRepository.save(user);
    }

    // ==============================
    // 🔹 APPROVED VETS
    // ==============================
    public List<User> getApprovedVets() {
        return userRepository.findAll().stream()
                .filter(u -> "VET".equals(u.getRole()) && "APPROVED".equals(u.getStatus()))
                .collect(Collectors.toList());
    }
}