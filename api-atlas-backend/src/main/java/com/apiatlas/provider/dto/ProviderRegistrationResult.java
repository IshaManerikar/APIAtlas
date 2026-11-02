package com.apiatlas.provider.dto;

public record ProviderRegistrationResult(
        String status,
        String providerReference,
        String accountToken,
        String failureReason
) {}