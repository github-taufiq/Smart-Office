package com.lift.conf.system.attendencebookingsystem.exception;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ErrorDetails {
    private final LocalDateTime timestamp;
    private final String message;
    private final String details;
    private final int statusCode;

    public ErrorDetails(LocalDateTime timestamp, String message, String details, int statusCode) {
        super();
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
        this.statusCode = statusCode;
    }
}