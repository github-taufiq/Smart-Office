package com.lift.conf.system.smartoffice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.HashSet;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // Or email

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String defaultTeamName; // User's default team name

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role; // ROLE_EMPLOYEE, ROLE_OFFICE_ADMIN, ROLE_SUPER_ADMIN

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "managed_office_id")
    private OfficeLocation managedOffice;

    @OneToMany(mappedBy = "requestedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Booking> requestedBookings = new HashSet<>();

    @OneToMany(mappedBy = "approvedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Booking> approvedBookings = new HashSet<>();

    public User() {
    }

    public User(String username, String password, String fullName, String defaultTeamName, UserRole role) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.defaultTeamName = defaultTeamName;
        this.role = role;
    }
}