package com.lift.conf.system.smartoffice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.HashSet;

@Setter
@Getter
@Entity
@Table(name = "rooms")
public class Room {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Aquamarine", "Ruby Hall"

    @Column(nullable = false)
    private int capacity; // 3 to 25 members

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "office_location_id", nullable = false)
    private OfficeLocation officeLocation; // Link to the specific office

    private boolean hasAVEquipment;

    private String description;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Booking> bookings = new HashSet<>();

    // Constructors
    public Room() {
    }

    public Room(String name, int capacity, OfficeLocation officeLocation, boolean hasAVEquipment, String description) {
        this.name = name;
        this.capacity = capacity;
        this.officeLocation = officeLocation;
        this.hasAVEquipment = hasAVEquipment;
        this.description = description;
    }

    // toString, equals, hashCode
}