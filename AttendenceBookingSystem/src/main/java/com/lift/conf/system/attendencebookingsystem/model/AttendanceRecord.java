package com.lift.conf.system.attendencebookingsystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Builder
@Table(name = "attendance_records", indexes = {
        @Index(name = "idx_attendancerecord_userid_date", columnList = "userId, attendanceDate", unique = true)
})
public class AttendanceRecord {

    public AttendanceRecord() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId; // External user ID from JWT/Auth service (Employee ID)

    public AttendanceRecord(Long id, String userId, String username, LocalDate attendanceDate, AttendanceStatus status, LeaveType leaveType, String leaveReason, LocalTime checkInTime, LocalTime checkOutTime, CheckInMethod checkInMethod, String modeOfTransport) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.leaveType = leaveType;
        this.leaveReason = leaveReason;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.checkInMethod = checkInMethod;
        this.modeOfTransport = modeOfTransport;
    }

    @Column(nullable = false)
    private String username; // Denormalized username for easier display, obtained from token or user service

    @Column(nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status; // WFO, WFH, ON_LEAVE

    @Enumerated(EnumType.STRING)
    private LeaveType leaveType; // SICK_LEAVE, PAID_LEAVE, HOLIDAY - only if status is ON_LEAVE

    private String leaveReason; // Optional text for leave

    private LocalTime checkInTime; // If status is WFO
    private LocalTime checkOutTime; // If status is WFO

    @Enumerated(EnumType.STRING)
    private CheckInMethod checkInMethod; // E.g., QR_CODE, LOCATION, WIFI_IP, MANUAL (if WFO)

    private String modeOfTransport; // If status is WFO

    public AttendanceRecord(String userId, String username, LocalDate attendanceDate, AttendanceStatus status) {
        this.userId = userId;
        this.username = username;
        this.attendanceDate = attendanceDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(LeaveType leaveType) {
        this.leaveType = leaveType;
    }

    public String getLeaveReason() {
        return leaveReason;
    }

    public void setLeaveReason(String leaveReason) {
        this.leaveReason = leaveReason;
    }

    public LocalTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalTime checkInTime) {
        this.checkInTime = checkInTime;
    }

    public LocalTime getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(LocalTime checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public CheckInMethod getCheckInMethod() {
        return checkInMethod;
    }

    public void setCheckInMethod(CheckInMethod checkInMethod) {
        this.checkInMethod = checkInMethod;
    }

    public String getModeOfTransport() {
        return modeOfTransport;
    }

    public void setModeOfTransport(String modeOfTransport) {
        this.modeOfTransport = modeOfTransport;
    }
}
