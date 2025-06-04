package com.lift.conf.system.attendencebookingsystem.dto;

import com.lift.conf.system.attendencebookingsystem.model.AttendanceStatus;
import com.lift.conf.system.attendencebookingsystem.model.CheckInMethod;
import com.lift.conf.system.attendencebookingsystem.model.LeaveType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime; // For check-in/out if provided manually

public class AttendanceRequestDto {
    @NotNull(message = "Attendance date cannot be null")
    private LocalDate attendanceDate; // Usually today's date, but allow for corrections by admin?

    @NotNull(message = "Attendance status cannot be null")
    private AttendanceStatus status;

    // For ON_LEAVE status
    private LeaveType leaveType;

    public @NotNull(message = "Attendance date cannot be null") LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(@NotNull(message = "Attendance date cannot be null") LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public @NotNull(message = "Attendance status cannot be null") AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(@NotNull(message = "Attendance status cannot be null") AttendanceStatus status) {
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

    private String leaveReason;

    // For WFO status
    private LocalTime checkInTime; // Optional: can be auto-set by system on auto check-in
    private LocalTime checkOutTime; // Optional: for manual checkout or updates
    private CheckInMethod checkInMethod; // If WFO, how was it marked? (e.g., MANUAL if user is just submitting the form)
    private String modeOfTransport;

    // For auto check-in methods, additional data might be sent:
    // private String qrCodeData;
    // private GeoLocationDto locationData;
    // private String wifiNetworkId; // If applicable
}
