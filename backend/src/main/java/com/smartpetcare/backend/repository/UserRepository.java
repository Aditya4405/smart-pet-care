package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; 

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // --- Added for DataSeeder & Security Auth ---
    boolean existsByEmail(String email);
    
    Optional<User> findByEmail(String email); 

    // --- Added for Admin Dashboard Analytics ---
    List<User> findByRole(String role);
    long countByRole(String role);
    long countByRoleAndStatus(String role, String status);

    // --- ADDED FOR THE GHOSTING PHASE (Moderation Lockdown) ---
    List<User> findByRoleAndStatus(String role, String status);
}