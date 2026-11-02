package com.apiatlas.dto;

import com.apiatlas.entity.enums.IncidentSeverity;

import java.time.LocalDateTime;

public record CreateIncidentRequest(
        String title,
        String description,
        String apiName,
        IncidentSeverity severity,
        LocalDateTime startedAt
) {
}