package com.apiatlas.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record PaymentInitiationRequest(

        @NotBlank
        @Size(max = 64)
        @Pattern(regexp = "^[A-Za-z0-9_-]+$")
        String clientReference,

        @NotNull
        @Positive
        Long beneficiaryId,

        @NotNull
        @DecimalMin("0.01")
        @Digits(integer = 17, fraction = 2)
        BigDecimal amount,

        @NotBlank
        @Pattern(regexp = "^[A-Z]{3}$")
        String currency,

        @Size(max = 255)
        String description
) {}
