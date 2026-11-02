package com.apiatlas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long paymentId,
        String clientReference,
        Long beneficiaryId,
        BigDecimal amount,
        String currency,
        String status,
        String providerReference
) {}
