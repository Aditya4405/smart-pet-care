package com.smartpetcare.backend.repository;

import com.smartpetcare.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByOwnerId(Long ownerId);
    List<Appointment> findByVetId(Long vetId);
 // Fetch upcoming appointments by status and date
    List<Appointment> findByStatusAndAppointmentDate(String status, String appointmentDate);
}