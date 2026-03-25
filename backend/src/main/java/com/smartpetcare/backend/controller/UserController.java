package com.smartpetcare.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

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
@CrossOrigin(origins = "*") 
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
            newUser.setPassword(null); 
            return ResponseEntity.ok(newUser);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // --- LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid credentials"));
            
            String status = user.getStatus() != null ? user.getStatus().toUpperCase() : "";
            if (status.equals("BANNED") || status.equals("SUSPENDED") || status.equals("REJECTED") || status.equals("INACTIVE")) {
                return ResponseEntity.status(403).body("Your account has been restricted or suspended by the Admin. Please contact Support.");
            }

            LoginResponseDTO response = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- GET SINGLE USER PROFILE ---
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(null); // Never send passwords to frontend
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- UPDATE USER PROFILE ---
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User updatedData) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Update Basic Info
            user.setFirstName(updatedData.getFirstName());
            user.setLastName(updatedData.getLastName());
            user.setPhone(updatedData.getPhone());
            user.setLocation(updatedData.getLocation());
            user.setGender(updatedData.getGender());
            
            // Update Vet Specific Info
            user.setClinicName(updatedData.getClinicName());
            user.setSpecialization(updatedData.getSpecialization());
            user.setLicenseNumber(updatedData.getLicenseNumber());
            
            // Save to database
            User savedUser = userRepository.save(user);
            savedUser.setPassword(null);
            
            return ResponseEntity.ok(savedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- TOGGLE VET AVAILABILITY (ONLINE/OFFLINE) ---
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id, @RequestParam Boolean isAvailable) {
        try {
            User vet = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Vet not found"));
            vet.setIsAvailable(isAvailable);
            User savedVet = userRepository.save(vet);
            savedVet.setPassword(null);
            return ResponseEntity.ok(savedVet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update availability");
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
            updatedUser.setPassword(null); 
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // --- FIND VETS PAGE (Returns ALL Approved Vets so UI can show offline badge) ---
    @GetMapping("/approved-vets")
    public ResponseEntity<List<User>> getApprovedVets() {
        List<User> allVets = new ArrayList<>();
        
        List<User> spelledVeterinarian = userRepository.findByRole("VETERINARIAN");
        List<User> spelledVet = userRepository.findByRole("VET");
        
        if (spelledVeterinarian != null) allVets.addAll(spelledVeterinarian);
        if (spelledVet != null) allVets.addAll(spelledVet);
        
        List<User> activeVets = allVets.stream()
                .filter(vet -> {
                    String status = vet.getStatus() != null ? vet.getStatus().toUpperCase() : "";
                    return status.equals("APPROVED") || status.equals("ACTIVE");
                })
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(activeVets);
    }
}