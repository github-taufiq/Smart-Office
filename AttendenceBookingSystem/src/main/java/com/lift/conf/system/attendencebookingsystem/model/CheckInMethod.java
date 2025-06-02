package com.lift.conf.system.attendencebookingsystem.model;

public enum CheckInMethod {
    LOCATION,
    QR_CODE,
    WIFI_IP, // Assuming this is the interpretation for Wi-Fi based check-in
    MANUAL, // User manually marks attendance
    QR
}
