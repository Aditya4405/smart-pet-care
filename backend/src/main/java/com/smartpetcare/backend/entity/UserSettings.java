package com.smartpetcare.backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "user_settings")
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    // --- OWNER & VET PREFERENCES ---
    private Boolean appointments = true;
    private Boolean vaccinations = true;
    private Boolean marketplace = false;
    private Boolean messages = true;
    private Boolean marketing = false;
    private Boolean sms = true;
    private String theme = "System";
    private String language = "English (US)";
    private Boolean useMetric = true;

    // --- ADMIN SECURITY POLICIES ---
    private Boolean enforce2FA = true;
    private String passwordPolicyLevel = "Enterprise";
    private Integer sessionTimeoutMinutes = 15;
    private Boolean geoRestrictionEnabled = true;
    private Boolean suspiciousLoginAlerts = true;
    private Boolean bruteForceProtection = true;
    private Boolean gdprMode = true;
    private Boolean auditLogLock = true;

    @ElementCollection
    @CollectionTable(name = "admin_ip_whitelist", joinColumns = @JoinColumn(name = "settings_id"))
    @Column(name = "ip_address")
    private List<String> ipWhitelist;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Boolean getAppointments() { return appointments; }
    public void setAppointments(Boolean appointments) { this.appointments = appointments; }
    public Boolean getVaccinations() { return vaccinations; }
    public void setVaccinations(Boolean vaccinations) { this.vaccinations = vaccinations; }
    public Boolean getMarketplace() { return marketplace; }
    public void setMarketplace(Boolean marketplace) { this.marketplace = marketplace; }
    public Boolean getMessages() { return messages; }
    public void setMessages(Boolean messages) { this.messages = messages; }
    public Boolean getMarketing() { return marketing; }
    public void setMarketing(Boolean marketing) { this.marketing = marketing; }
    public Boolean getSms() { return sms; }
    public void setSms(Boolean sms) { this.sms = sms; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public Boolean getUseMetric() { return useMetric; }
    public void setUseMetric(Boolean useMetric) { this.useMetric = useMetric; }
    public Boolean getEnforce2FA() { return enforce2FA; }
    public void setEnforce2FA(Boolean enforce2FA) { this.enforce2FA = enforce2FA; }
    public String getPasswordPolicyLevel() { return passwordPolicyLevel; }
    public void setPasswordPolicyLevel(String passwordPolicyLevel) { this.passwordPolicyLevel = passwordPolicyLevel; }
    public Integer getSessionTimeoutMinutes() { return sessionTimeoutMinutes; }
    public void setSessionTimeoutMinutes(Integer sessionTimeoutMinutes) { this.sessionTimeoutMinutes = sessionTimeoutMinutes; }
    public Boolean getGeoRestrictionEnabled() { return geoRestrictionEnabled; }
    public void setGeoRestrictionEnabled(Boolean geoRestrictionEnabled) { this.geoRestrictionEnabled = geoRestrictionEnabled; }
    public Boolean getSuspiciousLoginAlerts() { return suspiciousLoginAlerts; }
    public void setSuspiciousLoginAlerts(Boolean suspiciousLoginAlerts) { this.suspiciousLoginAlerts = suspiciousLoginAlerts; }
    public Boolean getBruteForceProtection() { return bruteForceProtection; }
    public void setBruteForceProtection(Boolean bruteForceProtection) { this.bruteForceProtection = bruteForceProtection; }
    public Boolean getGdprMode() { return gdprMode; }
    public void setGdprMode(Boolean gdprMode) { this.gdprMode = gdprMode; }
    public Boolean getAuditLogLock() { return auditLogLock; }
    public void setAuditLogLock(Boolean auditLogLock) { this.auditLogLock = auditLogLock; }
    public List<String> getIpWhitelist() { return ipWhitelist; }
    public void setIpWhitelist(List<String> ipWhitelist) { this.ipWhitelist = ipWhitelist; }
}