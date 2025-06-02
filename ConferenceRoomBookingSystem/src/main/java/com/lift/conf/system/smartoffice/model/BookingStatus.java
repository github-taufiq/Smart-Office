package com.lift.conf.system.smartoffice.model;

public enum BookingStatus {
    PENDING_APPROVAL, // Initial state after user requests
    APPROVED,         // Admin approved
    REJECTED,         // Admin rejected
    CANCELLED_BY_USER,
    CANCELLED_BY_ADMIN,
    COMPLETED         // After the meeting time has passed and it was approved
}