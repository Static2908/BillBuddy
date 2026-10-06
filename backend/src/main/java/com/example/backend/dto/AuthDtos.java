package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank @Size(max = 100) String fullName,
            @NotBlank @Email @Size(max = 150) String email,
            @NotBlank @Size(min = 8, max = 100) String password
    ) {
    }

    public record LoginRequest(
            @NotBlank @Email @Size(max = 150) String email,
            @NotBlank String password
    ) {
    }

    public record UserResponse(Long id, String fullName, String email, LocalDateTime createdAt) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }
}
