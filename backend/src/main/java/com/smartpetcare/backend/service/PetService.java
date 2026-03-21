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

    public Pet addPet(Long ownerId, Pet pet) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        pet.setOwner(owner);
        pet.setActive(true); 
        return petRepository.save(pet);
    }

    // --- FETCH SINGLE PET ---
    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
    }

    public List<Pet> getPetsByOwner(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    // --- UPDATE PET LOGIC (STRICTLY NAME AND WEIGHT ONLY) ---
    public Pet updatePet(Long id, Pet details) {
        Pet existingPet = getPetById(id);
        
        // Only these two fields are allowed to change
        existingPet.setName(details.getName());
        existingPet.setWeight(details.getWeight());
        
        // We explicitly DO NOT set Breed, Gender, or DOB here 
        // to ensure they remain unchanged in the database.
        
        return petRepository.save(existingPet);
    }

    public void deletePet(Long petId) {
        Pet pet = getPetById(petId);
        pet.setActive(false); 
        petRepository.save(pet);
    }
}