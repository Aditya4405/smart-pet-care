package com.smartpetcare.backend.controller;

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
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private FileService fileService; // 👈 Inject the new FileService

    // Endpoint: POST /api/users/register
    // consume = MULTIPART_FORM_DATA_VALUE allows file uploads
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @RequestPart("user") String userString, // User data comes as a JSON string
            @RequestPart(value = "certificate", required = false) MultipartFile certificate // The file
    ) {
        try {
            // 1. Convert the JSON String back to a User object
            ObjectMapper mapper = new ObjectMapper();
            User user = mapper.readValue(userString, User.class);
            
            // 2. If a file was uploaded, save it!
            if (certificate != null && !certificate.isEmpty()) {
                String fileName = fileService.saveFile(certificate);
                user.setCertificateUrl(fileName); // Save the file path to database
            }

            // 3. Save the user
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Endpoint: POST /api/users/login (Remains the same)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}