package com.smartpetcare.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String species; 
    private String breed;
    private String gender;
    private String weight;
    private String dateOfBirth; 

    private Boolean vaccinated;
    private Boolean neutered;
    @Column(length = 500)
    private String allergies;
    @Column(length = 500)
    private String existingConditions;

    private String primaryVet;
    private String lastCheckupDate;
    @Column(length = 500)
    private String currentMedications;
    
    private String medicalRecordUrl; 
    private String imageUrl;
    private boolean active = true;

    // --- NEW REAL VACCINATION FIELDS ---
    private String rabiesDate;
    private String parvoDate;
    private String bordetellaDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore 
    private User owner;

    public Pet() {}

    // --- GETTERS AND SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public Boolean getVaccinated() { return vaccinated; }
    public void setVaccinated(Boolean vaccinated) { this.vaccinated = vaccinated; }
    public Boolean getNeutered() { return neutered; }
    public void setNeutered(Boolean neutered) { this.neutered = neutered; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getExistingConditions() { return existingConditions; }
    public void setExistingConditions(String existingConditions) { this.existingConditions = existingConditions; }
    public String getPrimaryVet() { return primaryVet; }
    public void setPrimaryVet(String primaryVet) { this.primaryVet = primaryVet; }
    public String getLastCheckupDate() { return lastCheckupDate; }
    public void setLastCheckupDate(String lastCheckupDate) { this.lastCheckupDate = lastCheckupDate; }
    public String getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }
    public String getMedicalRecordUrl() { return medicalRecordUrl; }
    public void setMedicalRecordUrl(String medicalRecordUrl) { this.medicalRecordUrl = medicalRecordUrl; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    // GETTERS/SETTERS FOR NEW FIELDS
    public String getRabiesDate() { return rabiesDate; }
    public void setRabiesDate(String rabiesDate) { this.rabiesDate = rabiesDate; }
    public String getParvoDate() { return parvoDate; }
    public void setParvoDate(String parvoDate) { this.parvoDate = parvoDate; }
    public String getBordetellaDate() { return bordetellaDate; }
    public void setBordetellaDate(String bordetellaDate) { this.bordetellaDate = bordetellaDate; }
}