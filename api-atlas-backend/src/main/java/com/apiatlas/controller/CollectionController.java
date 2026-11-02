
package com.apiatlas.controller;

import com.apiatlas.dto.CollectionRequest;
import com.apiatlas.entity.ApiCollection;
import com.apiatlas.service.CollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiCollection createCollection(
            @RequestBody CollectionRequest request) {
        return collectionService.createCollection(request);
    }

    @GetMapping
    public List<ApiCollection> getAllCollections() {
        return collectionService.getAllCollections();
    }

    @GetMapping("/{id}")
    public ApiCollection getCollection(@PathVariable Long id) {
        return collectionService.getCollection(id);
    }

    @PutMapping("/{id}")
    public ApiCollection updateCollection(
            @PathVariable Long id,
            @RequestBody CollectionRequest request) {
        return collectionService.updateCollection(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
    }
}
