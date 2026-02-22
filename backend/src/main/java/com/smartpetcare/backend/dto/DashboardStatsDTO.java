package com.smartpetcare.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalDoctors;
    private long pendingApprovals;
    private double monthlyRevenue;
	public DashboardStatsDTO(long totalUsers, long totalDoctors, long pendingApprovals, double monthlyRevenue) {
		super();
		this.totalUsers = totalUsers;
		this.totalDoctors = totalDoctors;
		this.pendingApprovals = pendingApprovals;
		this.monthlyRevenue = monthlyRevenue;
	}
}