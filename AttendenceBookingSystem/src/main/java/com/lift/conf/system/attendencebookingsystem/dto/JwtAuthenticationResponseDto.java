package com.lift.conf.system.attendencebookingsystem.dto;
import lombok.Data;

@Data
public class JwtAuthenticationResponseDto {
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String role; // Or List<String> roles

    public JwtAuthenticationResponseDto(String accessToken, String username, String role) {
        this.accessToken = accessToken;
        this.username = username;
        this.role = role;
    }
}