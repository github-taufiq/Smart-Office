package com.smartoff.parking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "parking_slots")
public class ParkingSlot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "slot_number", nullable = false)
    private String slotNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SlotStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_row_id", nullable = false)
    private ParkingRow parkingRow;
    
    @Column(name = "occupied_since")
    private LocalDateTime occupiedSince;
    
    @Column(name = "vehicle_license_plate")
    private String vehicleLicensePlate;
    
    // Constructors, getters, and setters
    public ParkingSlot() {}
    
    // Add getters and setters here
}