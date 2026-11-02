package com.apiatlas.endpoint.dto;

import java.time.Instant;

public record EndpointTestResult(
        Long endpointId,
        String endpointName,
        String url,
        String method,
        Integer statusCode,
        long durationMs,
        boolean success,
        String responseBody,
        String errorMessage,
        Instant testedAt
) {}