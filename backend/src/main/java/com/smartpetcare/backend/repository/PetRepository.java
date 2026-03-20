package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    
    // UPDATED: Now only fetches pets that haven't been archived
    @Query("SELECT p FROM Pet p WHERE p.owner.id = :ownerId AND p.active = true")
    List<Pet> findByOwnerId(@Param("ownerId") Long ownerId);
    
    long count(); 
}