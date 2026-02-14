package com.smartpetcare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smartpetcare.backend.dto.DashboardStatsDTO;
import com.smartpetcare.backend.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    // NOTE: appointments and products are commented out until we create them!
    // @Autowired private AppointmentRepository appointmentRepository;
    // @Autowired private ProductRepository productRepository; 

    public DashboardStatsDTO getDashboardStats() {
        // Now these methods will work because we added them to UserRepository
        long totalUsers = userRepository.countByRole("USER");
        long totalDoctors = userRepository.countByRole("VET"); // Ensure we use "VET" if that's what you saved in DB
        long pendingDoctors = userRepository.countByRoleAndStatus("VET", "PENDING");
        
        // Mock revenue for now
        double monthlyRevenue = 12500.00; 

        return new DashboardStatsDTO(totalUsers, totalDoctors, pendingDoctors, monthlyRevenue);
    }
}