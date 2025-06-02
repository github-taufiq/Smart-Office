package com.lift.conf.system.attendencebookingsystem.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "office_locations")
public class OfficeLocation {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String city;

    private String address;

    @OneToMany(mappedBy = "officeLocation", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Room> rooms = new HashSet<>();

    public OfficeLocation() {
    }

    public OfficeLocation(String name, String city, String address) {
        this.name = name;
        this.city = city;
        this.address = address;
    }

}