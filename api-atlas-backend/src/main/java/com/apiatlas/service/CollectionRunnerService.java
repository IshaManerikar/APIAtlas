package com.apiatlas.service;

import com.apiatlas.dto.CollectionRunResult;
import com.apiatlas.endpoint.dto.EndpointTestResult;
import com.apiatlas.endpoint.service.EndpointTestService;
import com.apiatlas.repository.ApiCollectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class CollectionRunnerService {

    private final ApiCollectionRepository collectionRepository;
    private final EndpointTestService endpointTestService;

    public CollectionRunnerService(
            ApiCollectionRepository collectionRepository,
            EndpointTestService endpointTestService) {
        this.collectionRepository = collectionRepository;
        this.endpointTestService = endpointTestService;
    }

    public CollectionRunResult runCollection(Long collectionId) {

        var collection = collectionRepository.findByIdWithEndpoints(collectionId)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND, "Collection not found: " + collectionId));

        Instant startedAt = Instant.now();
        long startTime = System.nanoTime();

        List<EndpointTestResult> results = new ArrayList<>();

        for (var endpoint : collection.getEndpoints()) {
            EndpointTestResult result =
                    endpointTestService.testEndpoint(endpoint.getId());

            results.add(result);
        }

        long totalDurationMs =
                (System.nanoTime() - startTime) / 1_000_000;

        Instant completedAt = Instant.now();

        int passed = (int) results.stream()
                .filter(EndpointTestResult::success)
                .count();

        int failed = results.size() - passed;

        return new CollectionRunResult(
                collection.getId(),
                collection.getName(),
                results.size(),
                passed,
                failed,
                totalDurationMs,
                startedAt,
                completedAt,
                results
        );
    }
}