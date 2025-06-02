package com.lift.conf.system.smartoffice.dto;

import com.lift.conf.system.smartoffice.model.BookingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingResponseDto {
    private Long id;
    private Long roomId;
    private String roomName;
    private Long officeLocationId;
    private String officeLocationName;
    private Long requestedByUserId;
    private String requestedByUsername;
    private String teamName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private BookingStatus status;
    private Long approvedByUserId; // Nullable
    private String approvedByUsername; // Nullable
    private LocalDateTime requestTimestamp;
    private LocalDateTime decisionTimestamp; // Nullable
    private String adminNotes; // Nullable
}