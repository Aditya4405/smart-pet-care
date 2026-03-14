package com.smartpetcare.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartpetcare.backend.entity.Pet;
import com.smartpetcare.backend.repository.PetRepository;
import com.smartpetcare.backend.service.FileService;
import com.smartpetcare.backend.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:5173")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private FileService fileService;

    @Autowired
    private PetRepository petRepository;

    // --- ADD PET ---
    @PostMapping(value = "/owner/{ownerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPet(
            @PathVariable Long ownerId,
            @RequestPart("pet") String petString, 
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "medicalDocument", required = false) MultipartFile medicalDocument
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Pet pet = mapper.readValue(petString, Pet.class);

            if (image != null && !image.isEmpty()) {
                String imageName = fileService.saveFile(image);
                pet.setImageUrl(imageName); 
            }

            if (medicalDocument != null && !medicalDocument.isEmpty()) {
                String docName = fileService.saveFile(medicalDocument);
                pet.setMedicalRecordUrl(docName);
            }

            Pet savedPet = petService.addPet(ownerId, pet);
            return ResponseEntity.ok(savedPet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding pet: " + e.getMessage());
        }
    }

    // --- FIX 405 ERROR: FETCH SINGLE PET ---
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    // --- GET OWNER PETS ---
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Pet>> getOwnerPets(@PathVariable Long ownerId) {
        return ResponseEntity.ok(petService.getPetsByOwner(ownerId));
    }

    // --- UPDATE PET (For the Edit Modal) ---
    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @RequestBody Pet petDetails) {
        Pet updatedPet = petService.updatePet(id, petDetails);
        return ResponseEntity.ok(updatedPet);
    }

    // --- ARCHIVE (SOFT DELETE) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> archivePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok().body("Pet removed successfully.");
    }
}