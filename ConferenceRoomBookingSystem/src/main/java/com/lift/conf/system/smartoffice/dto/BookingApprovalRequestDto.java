package com.lift.conf.system.smartoffice.dto;

import com.lift.conf.system.smartoffice.model.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingApprovalRequestDto {
    @NotNull(message = "Status cannot be null. Must be APPROVED or REJECTED.")
    private BookingStatus status; // Should be either APPROVED or REJECTED
    private String adminNotes;
}
