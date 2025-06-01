package com.smartoff.parking.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "parking_rows")
public class ParkingRow {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "row_number", nullable = false)
    private String rowNumber;
    
    @Column(name = "parking_lot_id", nullable = false)
    private Long parkingLotId;
    
    @Column(name = "total_slots")
    private Integer totalSlots;
    
    @Column(name = "available_slots")
    private Integer availableSlots;

    @JsonManagedReference
    @OneToMany(mappedBy = "parkingRow", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ParkingSlot> parkingSlots;
    
    // Constructors, getters, and setters
    public ParkingRow() {}
    
    // Add getters and setters here
}