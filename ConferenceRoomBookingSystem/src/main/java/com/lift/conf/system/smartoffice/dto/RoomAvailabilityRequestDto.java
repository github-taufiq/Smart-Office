package com.lift.conf.system.smartoffice.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RoomAvailabilityRequestDto {
    @NotNull(message = "Office Location ID cannot be null")
    private Long officeLocationId;

    @NotNull(message = "Start time cannot be null")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time cannot be null")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int requiredCapacity; // Optional, default to 1 if not provided

    private Boolean requiresAVEquipment; // Optional
}