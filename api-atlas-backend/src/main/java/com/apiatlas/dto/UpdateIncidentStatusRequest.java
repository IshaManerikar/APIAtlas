package com.apiatlas.dto;

import com.apiatlas.entity.enums.IncidentStatus;

public record UpdateIncidentStatusRequest(
        IncidentStatus status
) {
}
