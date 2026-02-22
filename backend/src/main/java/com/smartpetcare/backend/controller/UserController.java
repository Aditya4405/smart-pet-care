package com.smartpetcare.backend.controller;

import java.util.List;
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

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private FileService fileService; 

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

    // --- LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            // Now returns the safe DTO
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
    @GetMapping("/approved-vets")
    public ResponseEntity<List<User>> getApprovedVets() {
        return ResponseEntity.ok(userService.getApprovedVets());
    }
}