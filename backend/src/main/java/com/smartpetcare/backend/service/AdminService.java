package com.smartpetcare.backend.service;

import com.smartpetcare.backend.dto.DashboardStatsDTO;
import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.repository.UserRepository;
import com.smartpetcare.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // 1. Dashboard Aggregation
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        stats.setTotalUsers(userRepository.countByRole("USER"));
        stats.setTotalDoctors(userRepository.countByRole("VET"));
        stats.setPendingApprovals(userRepository.countByRoleAndStatus("VET", "PENDING"));
        
        Double revenue = appointmentRepository.sumTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : 0.0);
        
        return stats;
    }

    // 2. Fetch User Lists
    public List<User> getAllUsers() {
        return userRepository.findByRole("USER");
    }

    public List<User> getAllVets() {
        return userRepository.findByRole("VET");
    }

    // 3. User & Vet Moderation (Approve, Reject, Suspend, Activate)
    public void updateUserStatus(Long id, String action) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            switch (action.toUpperCase()) {
                case "APPROVE":
                case "ACTIVATE":
                    user.setStatus("ACTIVE"); // or "APPROVED" depending on your logic
                    break;
                case "REJECT":
                    user.setStatus("REJECTED");
                    break;
                case "SUSPEND":
                    user.setStatus("SUSPENDED");
                    break;
            }
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }
}