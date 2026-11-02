package com.apiatlas.service;

import com.apiatlas.dto.CreateIncidentRequest;
import com.apiatlas.entity.enums.IncidentStatus;
import com.apiatlas.entity.Incident;
import com.apiatlas.repository.IncidentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public Incident createIncident(CreateIncidentRequest request) {
        if (request == null
                || isBlank(request.title())
                || isBlank(request.apiName())
                || request.severity() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Title, API name, and severity are required."
            );
        }

        Incident incident = new Incident();
        incident.setTitle(request.title().trim());
        incident.setDescription(request.description());
        incident.setApiName(request.apiName().trim());
        incident.setSeverity(request.severity());
        incident.setStatus(IncidentStatus.OPEN);

        if (request.startedAt() != null) {
            incident.setStartedAt(request.startedAt());
        }

        return incidentRepository.save(incident);
    }

    @Transactional(readOnly = true)
    public List<Incident> getAllIncidents(IncidentStatus status) {
        if (status == null) {
            return incidentRepository.findAllByOrderByCreatedAtDesc();
        }

        return incidentRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    @Transactional(readOnly = true)
    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Incident not found with ID: " + id
                ));
    }

    public Incident updateIncidentStatus(
            Long id,
            IncidentStatus newStatus
    ) {
        if (newStatus == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Incident status is required."
            );
        }

        Incident incident = getIncidentById(id);

        if (incident.getStatus() == IncidentStatus.CLOSED
                && newStatus != IncidentStatus.CLOSED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A closed incident cannot be reopened."
            );
        }

        if (newStatus == IncidentStatus.RESOLVED
                || newStatus == IncidentStatus.CLOSED) {
            if (incident.getResolvedAt() == null) {
                incident.setResolvedAt(LocalDateTime.now());
            }
        } else {
            incident.setResolvedAt(null);
        }

        incident.setStatus(newStatus);

        return incidentRepository.save(incident);
    }
    public Incident updateIncident(
            Long id,
            CreateIncidentRequest request
    ) {
        if (request == null
                || isBlank(request.title())
                || isBlank(request.apiName())
                || request.severity() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Title, API name, and severity are required."
            );
        }

        Incident incident = getIncidentById(id);

        incident.setTitle(request.title().trim());
        incident.setDescription(request.description());
        incident.setApiName(request.apiName().trim());
        incident.setSeverity(request.severity());

        if (request.startedAt() != null) {
            incident.setStartedAt(request.startedAt());
        }

        return incidentRepository.save(incident);
    }

    public void deleteIncident(Long id) {
        Incident incident = getIncidentById(id);
        incidentRepository.delete(incident);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

}