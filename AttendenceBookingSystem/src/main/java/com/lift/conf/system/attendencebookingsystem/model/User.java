package com.lift.conf.system.attendencebookingsystem.model;

import jakarta.persistence.*;
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // In `User.java`
    @Column(nullable = false)
    private Long managedOfficeId;

    public Long getManagedOfficeId() {
        return managedOfficeId;
    }

    public void setManagedOfficeId(Long managedOfficeId) {
        this.managedOfficeId = managedOfficeId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDefaultTeamName() {
        return defaultTeamName;
    }

    public void setDefaultTeamName(String defaultTeamName) {
        this.defaultTeamName = defaultTeamName;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

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
    private UserRole role; // ROLE_EMPLOYEE, ROLE_OFFICE_ADMIN, ROLE_MANAGER

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "managed_office_id")
//    private OfficeLocation managedOffice;
//
//    @OneToMany(mappedBy = "requestedBy", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Booking> requestedBookings = new HashSet<>();
//
//    @OneToMany(mappedBy = "approvedBy", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Booking> approvedBookings = new HashSet<>();

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