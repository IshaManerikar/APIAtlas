
package com.apiatlas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentDetailsResponse(
        Long paymentId,
        String clientReference,
        String idempotencyKey,
        Long beneficiaryId,
        String beneficiaryName,
        String bankName,
        String accountNumberMasked,
        String ifscCode,
        BigDecimal amount,
        String currency,
        String paymentStatus,
        String providerReference,
        String utr,
        String failureReason,
        LocalDateTime initiatedAt,
        LocalDateTime completedAt,
        LocalDateTime updatedAt
) {}
