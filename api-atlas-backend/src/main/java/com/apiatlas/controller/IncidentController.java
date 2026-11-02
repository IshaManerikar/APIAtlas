package com.apiatlas.controller;

import com.apiatlas.dto.CreateIncidentRequest;
import com.apiatlas.dto.UpdateIncidentStatusRequest;
import com.apiatlas.entity.Incident;

import com.apiatlas.entity.enums.IncidentStatus;
import com.apiatlas.service.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Incident createIncident(
            @RequestBody CreateIncidentRequest request
    ) {
        return incidentService.createIncident(request);
    }

    @GetMapping
    public List<Incident> getAllIncidents(
            @RequestParam(required = false) IncidentStatus status
    ) {
        return incidentService.getAllIncidents(status);
    }

    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id);
    }

    @PatchMapping("/{id}/status")
    public Incident updateIncidentStatus(
            @PathVariable Long id,
            @RequestBody UpdateIncidentStatusRequest request
    ) {
        return incidentService.updateIncidentStatus(id, request.status());
    }


    @PutMapping("/update/{id}")
    public Incident updateIncident(
            @PathVariable Long id,
            @RequestBody CreateIncidentRequest request
    ) {
        return incidentService.updateIncident(id, request);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
    }

}