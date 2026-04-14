package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.Appointment;
import com.smartpetcare.backend.entity.Pet;
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

    // ✅ FIXED: Needed by ReminderService
    List<Appointment> findByStatusAndAppointmentDate(String status, String appointmentDate);

    // Fetch only active pets for booking
    @Query("SELECT p FROM Pet p WHERE p.owner.id = :ownerId AND p.active = true")
    List<Pet> findAllActivePetsByOwnerId(@Param("ownerId") Long ownerId);

    // Calculates Gross Revenue from Paid or Completed appointments
    @Query("SELECT SUM(a.amountPaid) FROM Appointment a WHERE a.status = 'SCHEDULED' OR a.status = 'COMPLETED'")
    Double sumTotalRevenue();
}