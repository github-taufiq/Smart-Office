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
    // Or just EMPLOYEE if admins use a different system for corrections
    public ResponseEntity<AttendanceResponseDto> markAttendance(@Valid @RequestBody AttendanceRequestDto attendanceRequestDto) throws BadRequestException {
        AttendanceResponseDto responseDto = attendanceService.markAttendance(attendanceRequestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/my-records")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('OFFICE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<AttendanceResponseDto>> getMyAttendanceRecords(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        // Users can only fetch their own. Service layer enforces this based on authenticated principal.
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

    @PostMapping("/auto-checkin/qr-dynamic") // New distinct path
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<AttendanceResponseDto> autoCheckInViaDynamicQr(
            @Valid @RequestBody DynamicQrPayloadDto qrPayload,
            @RequestParam(required = false) String modeOfTransport) throws BadRequestException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserIdFromToken; // This should be the definitive Employee ID
        String authenticatedUsernameForRecord = "User"; // Default

        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            // Assuming UserPrincipal.getActualUserId() gives the Employee ID
            // And UserPrincipal.getUsername() gives the login username
            // Or UserPrincipal.getName() is configured to return the Employee ID
            authenticatedUserIdFromToken = principal.getActualUserId(); // Or principal.getName() if that's the Employee ID
            authenticatedUsernameForRecord = principal.getUsernameForRecord(); // e.g. principal.getFullName() or principal.getUsername()
        } else {
            // Fallback if UserPrincipal is not used, assuming getName() is the Employee ID
            authenticatedUserIdFromToken = authentication.getName();
            authenticatedUsernameForRecord = "User-" + authenticatedUserIdFromToken;
        }

        // Critical Validation: User ID in QR payload must match the authenticated user's ID from token
        if (!qrPayload.getUserId().equals(authenticatedUserIdFromToken)) {
            // Log this attempt - potential misuse
            System.err.println("Security Alert: QR User ID mismatch. QR_User: " + qrPayload.getUserId() + ", Token_User: " + authenticatedUserIdFromToken);
            throw new BadRequestException("QR code mismatch: This QR code is not for the currently logged-in user.");
        }

        // Validate QR type
        if (!"OFFICE_GATE_CHECKIN".equals(qrPayload.getType())) {
            throw new BadRequestException("Invalid QR code type specified.");
        }

        // Validate timestamp freshness (e.g., QR code valid for 5 minutes from its generation time)
        try {
            OffsetDateTime qrTimestamp = OffsetDateTime.parse(qrPayload.getTimestamp());
            OffsetDateTime currentUtcTime = OffsetDateTime.now(ZoneOffset.UTC);
            Duration timeDifference = Duration.between(qrTimestamp, currentUtcTime);

            // QR timestamp should not be in the future, and not too old
            if (timeDifference.isNegative() || timeDifference.toMinutes() > 5) {
                throw new BadRequestException("QR code has expired or its timestamp is invalid.");
            }
        } catch (Exception e) {
            // Log parsing error
            System.err.println("Error parsing QR timestamp: " + qrPayload.getTimestamp() + " - " + e.getMessage());
            throw new BadRequestException("Invalid QR code timestamp format. Expected ISO 8601 UTC.");
        }

        // Optional: Nonce validation (if you implement a cache for recently used nonces to prevent replay attacks)
        // if (nonceCacheService.isNonceUsed(qrPayload.getNonce())) {
        //     throw new BadRequestException("QR code has already been processed (nonce reuse).");
        // }
        // nonceCacheService.markNonceAsUsed(qrPayload.getNonce());


        // If all validations pass, proceed to record attendance
        AttendanceResponseDto responseDto = attendanceService.recordAutoCheckIn(
                authenticatedUserIdFromToken,    // Use the validated user ID from token
                authenticatedUsernameForRecord,  // Username for record
                LocalDate.now(),                 // Check-in is for the current date
                LocalTime.now(),                 // Check-in is at the current time
                CheckInMethod.QR_CODE,           // Method is QR Code
                modeOfTransport                  // Optional mode of transport
        );

        return ResponseEntity.ok(responseDto);
    }
}
