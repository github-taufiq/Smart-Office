package com.lift.conf.system.attendencebookingsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@NoArgsConstructor
@AllArgsConstructor
public class DynamicQrPayloadDto {

    @NotNull(message = "QR code ID cannot be null")
    @NotBlank(message = "User ID from QR code cannot be blank")
    private String userId; // User ID embedded in the QR code

    public @NotNull(message = "QR code ID cannot be null") @NotBlank(message = "User ID from QR code cannot be blank") String getUserId() {
        return userId;
    }

    public void setUserId(@NotNull(message = "QR code ID cannot be null") @NotBlank(message = "User ID from QR code cannot be blank") String userId) {
        this.userId = userId;
    }

    public @NotNull(message = "QR code ID cannot be null") @NotBlank(message = "Timestamp from QR code cannot be blank") @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$", message = "Timestamp must be in ISO 8601 format (UTC)") String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(@NotNull(message = "QR code ID cannot be null") @NotBlank(message = "Timestamp from QR code cannot be blank") @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$", message = "Timestamp must be in ISO 8601 format (UTC)") String timestamp) {
        this.timestamp = timestamp;
    }

    public @NotNull(message = "QR code ID cannot be null") @NotBlank(message = "Type from QR code cannot be blank") String getType() {
        return type;
    }

    public void setType(@NotNull(message = "QR code ID cannot be null") @NotBlank(message = "Type from QR code cannot be blank") String type) {
        this.type = type;
    }

    public @NotNull(message = "QR code ID cannot be null") @NotBlank(message = "Nonce from QR code cannot be blank") String getNonce() {
        return nonce;
    }

    public void setNonce(@NotNull(message = "QR code ID cannot be null") @NotBlank(message = "Nonce from QR code cannot be blank") String nonce) {
        this.nonce = nonce;
    }

    @NotNull(message = "QR code ID cannot be null")
    @NotBlank(message = "Timestamp from QR code cannot be blank")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$", message = "Timestamp must be in ISO 8601 format (UTC)")
    private String timestamp; // ISO 8601 timestamp string from QR

    @NotNull(message = "QR code ID cannot be null")
    @NotBlank(message = "Type from QR code cannot be blank")
    private String type; // e.g., "OFFICE_GATE_CHECKIN"

    @NotNull(message = "QR code ID cannot be null")
    @NotBlank(message = "Nonce from QR code cannot be blank")
    private String nonce;
}
