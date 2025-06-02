package com.lift.conf.system.smartoffice.controller;

import com.lift.conf.system.smartoffice.dto.JwtAuthenticationResponseDto;
import com.lift.conf.system.smartoffice.dto.LoginRequestDto;
import com.lift.conf.system.smartoffice.dto.SignUpRequestDto;
import com.lift.conf.system.smartoffice.exception.BadRequestException;
import com.lift.conf.system.smartoffice.model.OfficeLocation;
import com.lift.conf.system.smartoffice.model.User;
import com.lift.conf.system.smartoffice.model.UserRole;
import com.lift.conf.system.smartoffice.repository.*;
import com.lift.conf.system.smartoffice.security.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.GrantedAuthority;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final OfficeLocationRepository officeLocationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            OfficeLocationRepository officeLocationRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.officeLocationRepository = officeLocationRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        return ResponseEntity.ok(new JwtAuthenticationResponseDto(jwt, userDetails.getUsername(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequestDto signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ResponseEntity<>(Map.of("success", false, "message", "Username is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());
        user.setDefaultTeamName(signUpRequest.getDefaultTeamName());
        user.setRole(signUpRequest.getRole());

        if (signUpRequest.getRole() == UserRole.ROLE_OFFICE_ADMIN) {
            if (signUpRequest.getManagedOfficeId() == null) {
                throw new BadRequestException("Managed Office ID is required for Office Admins.");
            }
            OfficeLocation managedOffice = officeLocationRepository.findById(signUpRequest.getManagedOfficeId())
                    .orElseThrow(() -> new BadRequestException("Managed Office ID not found."));
            user.setManagedOffice(managedOffice);
        }

        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message", "User registered successfully!"));
    }
}