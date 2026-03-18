package com.smartpetcare.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime; 

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User vet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "owner"})
    private Pet pet;

    private String appointmentDate;
    private String appointmentTime;
    private String visitType; 
    
    // Will now use: PENDING, ACCEPTED, SCHEDULED, COMPLETED, CANCELLED, REJECTED
    private String status;    
    
    @Column(length = 500)
    private String symptoms;
    
    private Integer amountPaid;

    private String paymentStatus;
    private String transactionId;
    
 
    private String prescriptionFileUrl;

    public String getPrescriptionFileUrl() {
		return prescriptionFileUrl;
	}

	public void setPrescriptionFileUrl(String prescriptionFileUrl) {
		this.prescriptionFileUrl = prescriptionFileUrl;
	}
	// --- REPLACED videoRoomId WITH meetLink ---
    @Column(name = "meet_link")
    private String meetLink;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private String medicalReportUrl;
    
    @Column(length = 1000)
    private String clinicalNotes;
    private Boolean followUpEnabled;
    private Integer followUpDays;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- GETTERS AND SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public User getVet() { return vet; }
    public void setVet(User vet) { this.vet = vet; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getVisitType() { return visitType; }
    public void setVisitType(String visitType) { this.visitType = visitType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public Integer getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Integer amountPaid) { this.amountPaid = amountPaid; }

    public String getMedicalReportUrl() { return medicalReportUrl; }
    public void setMedicalReportUrl(String medicalReportUrl) { this.medicalReportUrl = medicalReportUrl; }
    
    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public Boolean getFollowUpEnabled() { return followUpEnabled; }
    public void setFollowUpEnabled(Boolean followUpEnabled) { this.followUpEnabled = followUpEnabled; }

    public Integer getFollowUpDays() { return followUpDays; }
    public void setFollowUpDays(Integer followUpDays) { this.followUpDays = followUpDays; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    // --- GETTER & SETTER FOR MEET LINK ---
    public String getMeetLink() { return meetLink; }
    public void setMeetLink(String meetLink) { this.meetLink = meetLink; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}