package com.smartpetcare.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.dto.LoginResponseDTO;
import com.smartpetcare.backend.service.FileService;
import com.smartpetcare.backend.service.UserService;
import com.smartpetcare.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private FileService fileService; 
    
    @Autowired
    private UserRepository userRepository;

    // --- REGISTER ENDPOINT ---
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @RequestPart("user") String userString, 
            @RequestPart(value = "certificate", required = false) MultipartFile certificate 
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            User user = mapper.readValue(userString, User.class);
            
            if (certificate != null && !certificate.isEmpty()) {
                String fileName = fileService.saveFile(certificate);
                user.setCertificateUrl(fileName);
            }

            User newUser = userService.registerUser(user);
            newUser.setPassword(null); // Hide password in the response
            return ResponseEntity.ok(newUser);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // --- LOGIN ENDPOINT (THE EVICTION PHASE) ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            // 1. Intercept the login to check for Moderation Bans
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
            
            // STRICT EVICTION CHECK: Block any negative status
            String status = user.getStatus() != null ? user.getStatus().toUpperCase() : "";
            if (status.equals("BANNED") || status.equals("SUSPENDED") || status.equals("REJECTED") || status.equals("INACTIVE")) {
                // Return a 403 Forbidden status so the frontend knows they are locked out
                return ResponseEntity.status(403).body("Your account has been restricted or suspended by the Admin. Please contact Support.");
            }

            // 2. If they are NOT banned, proceed with generating the JWT Token
            LoginResponseDTO response = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- ADMIN: GET PENDING VETS ---
    @GetMapping("/pending-vets")
    public ResponseEntity<List<User>> getPendingVets() {
        return ResponseEntity.ok(userService.getPendingVets());
    }

    // --- ADMIN: UPDATE STATUS ---
    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestParam String status) {
        try {
            User updatedUser = userService.updateUserStatus(userId, status);
            updatedUser.setPassword(null); // Hide password
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // --- FIND VETS PAGE (THE GHOSTING PHASE - ULTIMATE FIX) ---
    @GetMapping("/approved-vets")
    public ResponseEntity<List<User>> getApprovedVets() {
        // 1. Fetch BOTH role spellings and combine them into one master list
        List<User> allVets = new ArrayList<>();
        
        List<User> spelledVeterinarian = userRepository.findByRole("VETERINARIAN");
        List<User> spelledVet = userRepository.findByRole("VET");
        
        if (spelledVeterinarian != null) allVets.addAll(spelledVeterinarian);
        if (spelledVet != null) allVets.addAll(spelledVet);
        
        // 2. Filter the combined list to include BOTH "APPROVED" and "ACTIVE" statuses
        List<User> activeVets = allVets.stream()
                .filter(vet -> {
                    String status = vet.getStatus() != null ? vet.getStatus().toUpperCase() : "";
                    return status.equals("APPROVED") || status.equals("ACTIVE");
                })
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(activeVets);
    }
}