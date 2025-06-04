package com.lift.conf.system.attendencebookingsystem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class LoginRequestDto {
    @NotBlank
    private String username;

    public @NotBlank String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank String username) {
        this.username = username;
    }

    public @NotBlank String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank String password) {
        this.password = password;
    }

    @NotBlank
    private String password;
}