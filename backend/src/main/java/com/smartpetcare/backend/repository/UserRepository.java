package com.smartpetcare.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartpetcare.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);

    // 🔹 NEW: Custom counting methods for the Admin Dashboard
    long countByRole(String role);
    long countByRoleAndStatus(String role, String status);
}