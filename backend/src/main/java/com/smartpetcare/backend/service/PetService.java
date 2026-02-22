package com.smartpetcare.backend.service;

import com.smartpetcare.backend.entity.Pet;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.PetRepository;
import com.smartpetcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    // --- ADD A NEW PET ---
    public Pet addPet(Long ownerId, Pet pet) {
        // 1. Find the owner in the DB
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        // 2. Attach the pet to this owner
        pet.setOwner(owner);
        
        // 3. Save to database
        return petRepository.save(pet);
    }

    // --- GET PETS FOR DASHBOARD ---
    public List<Pet> getPetsByOwner(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    // --- DELETE PET ---
    public void deletePet(Long petId) {
        petRepository.deleteById(petId);
    }
}