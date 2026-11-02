package com.apiatlas.dto;

import java.time.LocalDateTime;

public record BeneficiaryRegistrationResponse(
        Long beneficiaryId,
        String clientReference,
        String registrationStatus,
        String providerReference,
        String message,
        String correlationId,
        LocalDateTime createdAt
) {}