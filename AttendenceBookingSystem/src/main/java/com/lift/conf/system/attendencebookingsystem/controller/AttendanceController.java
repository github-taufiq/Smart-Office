package com.lift.conf.system.attendencebookingsystem.controller;

import com.lift.conf.system.attendencebookingsystem.dto.AttendanceRequestDto;
import com.lift.conf.system.attendencebookingsystem.dto.AttendanceResponseDto;
import com.lift.conf.system.attendencebookingsystem.dto.DynamicQrPayloadDto;
import com.lift.conf.system.attendencebookingsystem.model.CheckInMethod;
import com.lift.conf.system.attendencebookingsystem.security.UserPrincipal;
import com.lift.conf.system.attendencebookingsystem.service.AttendanceService;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('OFFICE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<AttendanceResponseDto> markAttendance(@Valid @RequestBody AttendanceRequestDto attendanceRequestDto) throws BadRequestException {
        AttendanceResponseDto responseDto = attendanceService.markAttendance(attendanceRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/my-records")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('OFFICE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<AttendanceResponseDto>> getMyAttendanceRecords(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<AttendanceResponseDto> records = attendanceService.getMyAttendanceForPeriod(startDate, endDate);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/my-records/today")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('OFFICE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<AttendanceResponseDto> getMyAttendanceForToday() {
        AttendanceResponseDto record = attendanceService.getMyAttendanceForDate(LocalDate.now());
        if (record == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(record);
    }

    @GetMapping("/my-records/{date}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('OFFICE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<AttendanceResponseDto> getMyAttendanceForSpecificDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        AttendanceResponseDto record = attendanceService.getMyAttendanceForDate(date);
        if (record == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(record);
    }

    @GetMapping("/admin/daily-log/{date}")
    @PreAuthorize("hasRole('OFFICE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<AttendanceResponseDto>> getDailyAttendanceLog(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceResponseDto> dailyLog = attendanceService.getAttendanceForDateByAdmin(date);
        return ResponseEntity.ok(dailyLog);
    }

    @PostMapping("/auto-checkin/qr-dynamic")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<AttendanceResponseDto> autoCheckInViaDynamicQr(
            @Valid @RequestBody DynamicQrPayloadDto qrPayload,
            @RequestParam(required = false) String modeOfTransport) throws BadRequestException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserIdFromToken; // This should be the definitive Employee ID
        String authenticatedUsernameForRecord = "User"; // Default

        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            authenticatedUserIdFromToken = principal.getActualUserId();
            authenticatedUsernameForRecord = principal.getUsernameForRecord();
        } else {
            authenticatedUserIdFromToken = authentication.getName();
            authenticatedUsernameForRecord = "User-" + authenticatedUserIdFromToken;
        }

        if (!qrPayload.getUserId().equals(authenticatedUserIdFromToken)) {
            System.err.println("Security Alert: QR User ID mismatch. QR_User: " + qrPayload.getUserId() + ", Token_User: " + authenticatedUserIdFromToken);
            throw new BadRequestException("QR code mismatch: This QR code is not for the currently logged-in user.");
        }

        if (!"OFFICE_GATE_CHECKIN".equals(qrPayload.getType())) {
            throw new BadRequestException("Invalid QR code type specified.");
        }

        try {
            OffsetDateTime qrTimestamp = OffsetDateTime.parse(qrPayload.getTimestamp());
            OffsetDateTime currentUtcTime = OffsetDateTime.now(ZoneOffset.UTC);
            Duration timeDifference = Duration.between(qrTimestamp, currentUtcTime);

            if (timeDifference.isNegative() || timeDifference.toMinutes() > 5) {
                throw new BadRequestException("QR code has expired or its timestamp is invalid.");
            }
        } catch (Exception e) {
            System.err.println("Error parsing QR timestamp: " + qrPayload.getTimestamp() + " - " + e.getMessage());
            throw new BadRequestException("Invalid QR code timestamp format. Expected ISO 8601 UTC.");
        }
        AttendanceResponseDto responseDto = attendanceService.recordAutoCheckIn(
                authenticatedUserIdFromToken,
                authenticatedUsernameForRecord,
                LocalDate.now(),
                LocalTime.now(),
                CheckInMethod.QR_CODE,
                modeOfTransport
        );
        return ResponseEntity.ok(responseDto);
    }
}
