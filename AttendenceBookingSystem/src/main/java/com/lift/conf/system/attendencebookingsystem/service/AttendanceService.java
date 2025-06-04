package com.lift.conf.system.attendencebookingsystem.service;

import com.lift.conf.system.attendencebookingsystem.dto.*;
import com.lift.conf.system.attendencebookingsystem.model.AttendanceRecord;
import com.lift.conf.system.attendencebookingsystem.model.AttendanceStatus;
import com.lift.conf.system.attendencebookingsystem.model.CheckInMethod;
import com.lift.conf.system.attendencebookingsystem.repository.*;
import com.lift.conf.system.attendencebookingsystem.security.UserPrincipal;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @Transactional
    public AttendanceResponseDto markAttendance(AttendanceRequestDto requestDto) throws BadRequestException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName(); // Or get a custom UserPrincipal object
        String username = "User-" + userId; // Placeholder - replace with actual username retrieval
        if (authentication.getPrincipal() instanceof UserPrincipal) { // Assuming you have a UserPrincipal class
            username = ((UserPrincipal) authentication.getPrincipal()).getUsernameForRecord();
        }


        LocalDate today = LocalDate.now();
        if (!requestDto.getAttendanceDate().isEqual(today)) {
            throw new BadRequestException("Attendance can only be marked for today: " + today);
        }

        // Check if attendance for this user and date already exists
        Optional<AttendanceRecord> existingRecordOpt = attendanceRecordRepository.findByUserIdAndAttendanceDate(userId, requestDto.getAttendanceDate());

        AttendanceRecord attendanceRecord;
        if (existingRecordOpt.isPresent()) {
            attendanceRecord = existingRecordOpt.get();
            if (attendanceRecord.getStatus() == AttendanceStatus.ON_LEAVE &&
                    (requestDto.getStatus() == AttendanceStatus.WFO || requestDto.getStatus() == AttendanceStatus.WFH)) {
                throw new BadRequestException("Cannot change from ON_LEAVE without proper channels. Current status: " + attendanceRecord.getStatus());
            }
        } else {
            attendanceRecord = new AttendanceRecord(userId, username, requestDto.getAttendanceDate(), requestDto.getStatus());
        }

        attendanceRecord.setUsername(username); // Ensure username is set/updated
        attendanceRecord.setStatus(requestDto.getStatus());

        switch (requestDto.getStatus()) {
            case WFO:
                attendanceRecord.setLeaveType(null);
                attendanceRecord.setLeaveReason(null);

                if (requestDto.getCheckInTime() != null) {
                    attendanceRecord.setCheckInTime(requestDto.getCheckInTime());
                } else if (attendanceRecord.getCheckInTime() == null && (requestDto.getCheckInMethod() == CheckInMethod.MANUAL || requestDto.getCheckInMethod() == null)) {
                    attendanceRecord.setCheckInTime(LocalTime.now());
                }
                if (requestDto.getCheckOutTime() != null) {
                    attendanceRecord.setCheckOutTime(requestDto.getCheckOutTime());
                }
                attendanceRecord.setCheckInMethod(requestDto.getCheckInMethod() != null ? requestDto.getCheckInMethod() : CheckInMethod.MANUAL);
                attendanceRecord.setModeOfTransport(requestDto.getModeOfTransport());
                break;
            case WFH:
                attendanceRecord.setLeaveType(null);
                attendanceRecord.setLeaveReason(null);
                attendanceRecord.setCheckInTime(null);
                attendanceRecord.setCheckOutTime(null);
                attendanceRecord.setCheckInMethod(null);
                attendanceRecord.setModeOfTransport(null);
                break;
            case ON_LEAVE:
                if (requestDto.getLeaveType() == null) {
                    throw new BadRequestException("Leave type is required when status is ON_LEAVE.");
                }
                attendanceRecord.setLeaveType(requestDto.getLeaveType());
                attendanceRecord.setLeaveReason(requestDto.getLeaveReason());
                attendanceRecord.setCheckInTime(null);
                attendanceRecord.setCheckOutTime(null);
                attendanceRecord.setCheckInMethod(null);
                attendanceRecord.setModeOfTransport(null);
                break;
            default:
                throw new BadRequestException("Invalid attendance status.");
        }

        AttendanceRecord savedRecord = attendanceRecordRepository.save(attendanceRecord);
        return mapToResponseDto(savedRecord);
    }

    @Transactional
    public AttendanceResponseDto recordAutoCheckIn(String userId, String username, LocalDate date, LocalTime time, CheckInMethod method, String modeOfTransport) {
        Optional<AttendanceRecord> existingRecordOpt = attendanceRecordRepository.findByUserIdAndAttendanceDate(userId, date);
        AttendanceRecord attendanceRecord;

        // If already checked in WFO and it's a new auto check-in, update method or ignore?
        // If WFH/ON_LEAVE, this auto check-in overrides it.
        attendanceRecord = existingRecordOpt.orElseGet(() -> new AttendanceRecord(userId, username, date, AttendanceStatus.WFO));

        attendanceRecord.setUsername(username);
        attendanceRecord.setStatus(AttendanceStatus.WFO);
        if (attendanceRecord.getCheckInTime() == null) { // Only set first check-in time
            attendanceRecord.setCheckInTime(time);
        }
        attendanceRecord.setCheckInMethod(method);
        attendanceRecord.setModeOfTransport(modeOfTransport); // Mode of transport might be asked after auto check-in via a notification + form

        // Clear leave fields if overriding leave
        attendanceRecord.setLeaveType(null);
        attendanceRecord.setLeaveReason(null);

        AttendanceRecord savedRecord = attendanceRecordRepository.save(attendanceRecord);
        return mapToResponseDto(savedRecord);
    }


    public List<AttendanceResponseDto> getMyAttendanceForPeriod(LocalDate startDate, LocalDate endDate) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        return attendanceRecordRepository.findByUserIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(userId, startDate, endDate)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public AttendanceResponseDto getMyAttendanceForDate(LocalDate date) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return attendanceRecordRepository.findByUserIdAndAttendanceDate(userId, date)
                .map(this::mapToResponseDto)
                .orElse(null); // Or throw ResourceNotFoundException if you want to enforce record existence
    }

    // --- Admin related methods (example) ---
    public List<AttendanceResponseDto> getAttendanceForDateByAdmin(LocalDate date) {
        // Add role checks here: only admins should access this
        return attendanceRecordRepository.findByAttendanceDate(date)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private AttendanceResponseDto mapToResponseDto(AttendanceRecord record) {
        AttendanceResponseDto dto = new AttendanceResponseDto();
        dto.setId(record.getId());
        dto.setUserId(record.getUserId());
        dto.setUsername(record.getUsername());
        dto.setAttendanceDate(record.getAttendanceDate());
        dto.setStatus(record.getStatus());
        dto.setLeaveType(record.getLeaveType());
        dto.setLeaveReason(record.getLeaveReason());
        dto.setCheckInTime(record.getCheckInTime());
        dto.setCheckOutTime(record.getCheckOutTime());
        dto.setCheckInMethod(record.getCheckInMethod());
        dto.setModeOfTransport(record.getModeOfTransport());
        return dto;
    }
}
