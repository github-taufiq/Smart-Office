package com.lift.conf.system.attendencebookingsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by_user_id", nullable = false)
    private User requestedBy; // The user who initiated the booking request

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private String teamName;

    private String purpose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_user_id")
    private User approvedBy;

    private LocalDateTime requestTimestamp;
    private LocalDateTime decisionTimestamp;
    private String adminNotes;

    public Booking() {
        this.requestTimestamp = LocalDateTime.now();
    }

    public Booking(Room room, User requestedBy, LocalDateTime startTime, LocalDateTime endTime, String teamName, String purpose) {
        this();
        this.room = room;
        this.requestedBy = requestedBy;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teamName = teamName;
        this.purpose = purpose;
        this.status = BookingStatus.PENDING_APPROVAL; // Default status on creation
    }

}