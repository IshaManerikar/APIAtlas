
package com.apiatlas.dto;

import java.time.LocalDateTime;

public record BeneficiaryStatusResponse(
        Long beneficiaryId,
        String clientReference,
        String beneficiaryName,
        String bankName,
        String accountNumberMasked,
        String ifscCode,
        String status,
        String providerReference,
        String failureReason,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
