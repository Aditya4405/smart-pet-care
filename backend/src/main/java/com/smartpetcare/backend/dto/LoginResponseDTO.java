package com.smartpetcare.backend.dto;

import com.smartpetcare.backend.entity.User;

public class LoginResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String status;
    private String token; // NEW FIELD FOR JWT

    public LoginResponseDTO() {}

    public LoginResponseDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.status = user.getStatus();
    }

    // --- MANUAL GETTERS & SETTERS (To prevent HttpMediaTypeNotAcceptableException) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // GETTER & SETTER FOR TOKEN
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}