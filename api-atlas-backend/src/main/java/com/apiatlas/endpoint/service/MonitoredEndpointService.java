
package com.apiatlas.endpoint.service;

import com.apiatlas.endpoint.entity.MonitoredEndpoint;
import com.apiatlas.endpoint.repository.MonitoredEndpointRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class MonitoredEndpointService {

    private final MonitoredEndpointRepository repository;

    public MonitoredEndpointService(
            MonitoredEndpointRepository repository) {
        this.repository = repository;
    }

    public List<MonitoredEndpoint> getAll() {
        return repository.findAll();
    }

    @Transactional
    public MonitoredEndpoint create(MonitoredEndpoint endpoint) {
        endpoint.setStatus("PENDING");

        if (endpoint.getMethod() == null
                || endpoint.getMethod().isBlank()) {
            endpoint.setMethod("GET");
        } else {
            endpoint.setMethod(endpoint.getMethod().trim().toUpperCase());
        }

        return repository.save(endpoint);
    }

    public MonitoredEndpoint getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND,
                        "Endpoint not found: " + id));
    }

    public MonitoredEndpoint update(Long id, MonitoredEndpoint updatedEndpoint) {
        MonitoredEndpoint existing = getById(id);

        existing.setName(updatedEndpoint.getName());
        existing.setUrl(updatedEndpoint.getUrl());
        existing.setMethod(updatedEndpoint.getMethod());
        existing.setRequestBody(updatedEndpoint.getRequestBody());

        return repository.save(existing);
    }

    public void delete(Long id) {
        MonitoredEndpoint existing = getById(id);
        repository.delete(existing);
    }
}
