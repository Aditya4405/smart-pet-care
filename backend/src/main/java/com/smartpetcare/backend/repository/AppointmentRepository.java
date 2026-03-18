package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.entity.Pet; // Import Pet entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Fetches all appointments belonging to a specific Pet Owner
    List<Appointment> findByOwnerId(Long ownerId);

    // Fetches appointments for a specific Vet
    List<Appointment> findByVetId(Long vetId);

    // --- NEW: FETCH ONLY ACTIVE PETS FOR BOOKING ---
    // This query lives here or in PetRepository to ensure the dropdown only shows pets that aren't archived
    @Query("SELECT p FROM Pet p WHERE p.owner.id = :ownerId AND p.active = true")
    List<Pet> findAllActivePetsByOwnerId(@Param("ownerId") Long ownerId);

    // Calculates Gross Revenue from Paid or Completed appointments
    // Note: Use 'SCHEDULED' if that's your status for paid appointments
    @Query("SELECT SUM(a.amountPaid) FROM Appointment a WHERE a.status = 'SCHEDULED' OR a.status = 'COMPLETED'")
    Double sumTotalRevenue();
}