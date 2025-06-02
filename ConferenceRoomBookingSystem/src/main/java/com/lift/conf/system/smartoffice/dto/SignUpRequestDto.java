package com.lift.conf.system.smartoffice.dto;

import com.lift.conf.system.smartoffice.model.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignUpRequestDto {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    @Size(min = 3, max = 100)
    private String fullName;

    @NotBlank
    private String defaultTeamName;

    @NotNull // Role must be provided during signup for this example
    private UserRole role; // e.g., ROLE_EMPLOYEE, ROLE_OFFICE_ADMIN. Consider how admins are created.
    // For office admins, you might also need 'managedOfficeId'
    private Long managedOfficeId; // Optional: Only if signing up an OFFICE_ADMIN and associating them directly
}
