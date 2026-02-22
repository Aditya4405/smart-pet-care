package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    
    // Custom method to fetch all pets for a specific user
    List<Pet> findByOwnerId(Long ownerId);
    
    // Optional: Admin might want to count total pets on the platform
    long count(); 
}