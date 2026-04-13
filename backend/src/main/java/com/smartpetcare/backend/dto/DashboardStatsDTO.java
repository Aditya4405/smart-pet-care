package com.smartpetcare.backend.dto;

public class DashboardStatsDTO {
    private Double totalRevenue;
    private Long totalUsers;
    private Long totalDoctors;
    private Long pendingApprovals;

    // Default Constructor
    public DashboardStatsDTO() {}

    // Getters and Setters
    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(Long totalDoctors) { this.totalDoctors = totalDoctors; }

    public Long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(Long pendingApprovals) { this.pendingApprovals = pendingApprovals; }
}