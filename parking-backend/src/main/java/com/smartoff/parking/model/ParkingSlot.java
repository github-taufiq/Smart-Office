package com.smartoff.parking.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "parking_row_id")
    private ParkingRow parkingRow;
    
    @Column(name = "occupied_since")
    private LocalDateTime occupiedSince;
    
    @Column(name = "vehicle_license_plate")
    private String vehicleLicensePlate;
    
    @Column(name = "reservation_expires_at")
    private LocalDateTime reservationExpiresAt;
    
    // Constructors, getters, and setters
    public ParkingSlot() {}
    
    // Add getters and setters here
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }

    public SlotStatus getStatus() { return status; }
    public void setStatus(SlotStatus status) { this.status = status; }

    public String getVehicleLicensePlate() { return vehicleLicensePlate; }
    public void setVehicleLicensePlate(String vehicleLicensePlate) { this.vehicleLicensePlate = vehicleLicensePlate; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public LocalDateTime getOccupiedSince() { return occupiedSince; }
    public void setOccupiedSince(LocalDateTime occupiedSince) { this.occupiedSince = occupiedSince; }

    public LocalDateTime getReservationExpiresAt() { 
        return reservationExpiresAt; 
    }

    public void setReservationExpiresAt(LocalDateTime reservationExpiresAt) { 
        this.reservationExpiresAt = reservationExpiresAt; 
    }

    @Column(name = "reserved_by_user")
    private String reservedByUser;

    public String getReservedByUser() { 
        return reservedByUser; 
    }

    public void setReservedByUser(String reservedByUser) { 
        this.reservedByUser = reservedByUser; 
    }
}