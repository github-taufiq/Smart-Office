package com.lift.conf.system.smartoffice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequestDto {
    @NotNull(message = "Room ID cannot be null")
    private Long roomId;

    @NotNull(message = "Start time cannot be null")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time cannot be null")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @NotBlank(message = "Team name cannot be blank")
    private String teamName;

    private String purpose; // Optional

    // Add any other fields user needs to submit during booking request
}