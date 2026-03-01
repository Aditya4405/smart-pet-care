package com.smartpetcare.backend.dto;

public class ReportRequestDTO {
    private String target;
    private String reason;
    private String severity;

    // Getters and Setters
    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}