
package com.apiatlas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record BeneficiaryRegistrationRequest(

        @NotBlank
        @Size(max = 64)
        @Pattern(regexp = "^[A-Za-z0-9_-]+$")
        String clientReference,

        @NotBlank
        @Size(max = 150)
        String beneficiaryName,

        @NotBlank
        @Size(max = 100)
        String bankName,

        @NotBlank
        @Pattern(regexp = "^[0-9]{8,18}$")
        String accountNumber,

        @NotBlank
        @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$")
        String ifscCode
) {}
