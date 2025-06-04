package com.lift.conf.system.attendencebookingsystem.dto;

import com.lift.conf.system.attendencebookingsystem.model.AttendanceStatus;
import com.lift.conf.system.attendencebookingsystem.model.CheckInMethod;
import com.lift.conf.system.attendencebookingsystem.model.LeaveType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;
import java.time.LocalTime; // For check-in/out if provided manually

public class AttendanceRequestDto {

    @NotNull(message = "Attendance date cannot be null")
    @PastOrPresent(message = "Attendance date must be today or in the past")
    private LocalDate attendanceDate;
    @NotNull(message = "Attendance status cannot be null")
    private AttendanceStatus status;
    private LeaveType leaveType;
    private String leaveReason;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private CheckInMethod checkInMethod;
    private String modeOfTransport;

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


}
