package com.smartpetcare.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.service.FileService;
import com.smartpetcare.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private FileService fileService; 

    // --- REGISTER ENDPOINT (Multipart for File Upload) ---
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @RequestPart("user") String userString, // User data as JSON string
            @RequestPart(value = "certificate", required = false) MultipartFile certificate // File
    ) {
        try {
            // 1. Convert JSON String to User object
            ObjectMapper mapper = new ObjectMapper();
            User user = mapper.readValue(userString, User.class);
            
            // 2. Save File if present
            if (certificate != null && !certificate.isEmpty()) {
                String fileName = fileService.saveFile(certificate);
                user.setCertificateUrl(fileName);
            }

            // 3. Register User
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // --- LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- ADMIN: GET PENDING VETS ---
    @GetMapping("/pending-vets")
    public ResponseEntity<List<User>> getPendingVets() {
        return ResponseEntity.ok(userService.getPendingVets());
    }

    // --- ADMIN: UPDATE STATUS (Approve/Reject) ---
    // Usage: PUT /api/users/5/status?status=APPROVED
    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestParam String status) {
        try {
            User updatedUser = userService.updateUserStatus(userId, status);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}