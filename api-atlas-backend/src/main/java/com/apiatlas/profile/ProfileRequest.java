package com.apiatlas.profile;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileRequest(
        @NotBlank
        @Size(max = 100)
        String fullName,

        @NotBlank
        @Email
        @Size(max = 150)
        String email,

        @Size(max = 100)
        String jobTitle,

        @Size(max = 100)
        String department,

        @Size(max = 20)
        String phoneNumber,

        @Size(max = 500)
        String profileImageUrl
) {
}
