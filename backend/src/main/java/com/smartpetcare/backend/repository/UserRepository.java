package com.smartpetcare.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartpetcare.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Custom method to find a user by email
    // Spring Boot automatically understands this and writes the SQL for you!
    Optional<User> findByEmail(String email);
    
    // We can verify if an email exists before signup
    Boolean existsByEmail(String email);
}