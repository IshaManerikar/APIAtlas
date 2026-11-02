
package com.apiatlas.service;

import com.apiatlas.dto.CollectionRequest;
import com.apiatlas.entity.ApiCollection;
import com.apiatlas.endpoint.entity.MonitoredEndpoint;
import com.apiatlas.repository.ApiCollectionRepository;
import com.apiatlas.endpoint.repository.MonitoredEndpointRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.apiatlas.exceptions.CollectionAlreadyExistsException;

import java.util.ArrayList;
import java.util.List;

@Service
public class CollectionService {

    private final ApiCollectionRepository collectionRepository;
    private final MonitoredEndpointRepository endpointRepository;

    public CollectionService(
            ApiCollectionRepository collectionRepository,
            MonitoredEndpointRepository endpointRepository) {
        this.collectionRepository = collectionRepository;
        this.endpointRepository = endpointRepository;
    }

    public List<ApiCollection> getAllCollections() {
        return collectionRepository.findAllWithEndpoints();
    }

    public ApiCollection getCollection(Long id) {
        return collectionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Collection not found: " + id));
    }

    @Transactional
    public ApiCollection createCollection(CollectionRequest request) {

        if (request.getName() == null ||
                request.getName().isBlank()) {
            throw new RuntimeException("Collection name is required");
        }

        if (collectionRepository.existsByNameIgnoreCase(
                request.getName().trim())) {
            throw new CollectionAlreadyExistsException(
                    "Collection name already exists."
            );
        }

        ApiCollection collection = new ApiCollection();
        collection.setName(request.getName().trim());
        collection.setDescription(request.getDescription());

        collection.setEndpoints(getEndpoints(request.getEndpointIds()));

        return collectionRepository.save(collection);
    }

    @Transactional
    public ApiCollection updateCollection(Long id, CollectionRequest request) {

        ApiCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collection not found"));

        collection.setName(request.getName());
        collection.setDescription(request.getDescription());

        List<MonitoredEndpoint> endpoints = request.getEndpointIds() == null
                ? new ArrayList<>()
                : getEndpoints(request.getEndpointIds());

        collection.setEndpoints(endpoints);

        return collectionRepository.save(collection);
    }

    public void deleteCollection(Long id) {
        ApiCollection collection = getCollection(id);
        collectionRepository.delete(collection);
    }

    private List<MonitoredEndpoint> getEndpoints(List<Long> endpointIds) {

        if (endpointIds == null || endpointIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<MonitoredEndpoint> endpoints =
                endpointRepository.findAllById(endpointIds);

        if (endpoints.size() != endpointIds.stream().distinct().count()) {
            throw new RuntimeException("One or more endpoints not found.");
        }

        return endpoints;
    }
}
