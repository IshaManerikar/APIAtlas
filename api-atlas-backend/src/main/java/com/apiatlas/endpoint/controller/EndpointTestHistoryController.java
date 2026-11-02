package com.apiatlas.endpoint.controller;

import com.apiatlas.endpoint.entity.EndpointTestHistory;
import com.apiatlas.endpoint.repository.EndpointTestHistoryRepository;
import com.apiatlas.endpoint.repository.MonitoredEndpointRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/endpoints")
public class EndpointTestHistoryController {

    private final EndpointTestHistoryRepository historyRepository;
    private final MonitoredEndpointRepository endpointRepository;

    public EndpointTestHistoryController(
            EndpointTestHistoryRepository historyRepository,
            MonitoredEndpointRepository endpointRepository
    ) {
        this.historyRepository = historyRepository;
        this.endpointRepository = endpointRepository;
    }

    @GetMapping("/{id}/history")
    public List<EndpointTestHistory> getHistory(@PathVariable Long id) {
        if (!endpointRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Endpoint not found: " + id
            );
        }

        return historyRepository
                .findByEndpointIdOrderByTestedAtDesc(id);
    }
}
