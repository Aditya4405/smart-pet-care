package com.smartpetcare.backend.dto;

public class TicketRequestDTO {
    private String userName;
    private String userRole;
    private String issue;
    private String priority; // "Low", "Normal", "Urgent"

    // Getters and Setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public String getIssue() { return issue; }
    public void setIssue(String issue) { this.issue = issue; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}