package com.apiatlas.dto;

import com.apiatlas.endpoint.dto.EndpointTestResult;

import java.time.Instant;
import java.util.List;

public record CollectionRunResult(
        Long collectionId,
        String collectionName,
        int totalEndpoints,
        int passed,
        int failed,
        long totalDurationMs,
        Instant startedAt,
        Instant completedAt,
        List<EndpointTestResult> results
) {
}