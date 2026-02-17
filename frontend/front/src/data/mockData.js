// src/data/mockData.js
export const mockAppointments = [
  {
    id: 101,
    doctorName: "Dr. Sarah Smith",
    specialty: "Veterinarian",
    appointmentDate: "2024-02-14T10:00:00", // Past date
    status: "COMPLETED",
    followUpAllowedUntil: "2026-02-20T23:59:59", // Future date (Active Window)
    followUpUsed: false,
    price: 50,
    petName: "Bella"
  },
  {
    id: 102,
    doctorName: "Dr. James Doe",
    specialty: "Pet Surgeon",
    appointmentDate: "2023-10-10T14:00:00",
    status: "COMPLETED",
    followUpAllowedUntil: "2023-10-13T23:59:59", // Past date (Expired)
    followUpUsed: false,
    price: 80,
    petName: "Max"
  }
];