package com.apiatlas.controller;

import com.apiatlas.dto.CollectionRunResult;
import com.apiatlas.service.CollectionRunnerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/collections")
public class CollectionRunnerController {

    private final CollectionRunnerService collectionRunnerService;

    public CollectionRunnerController(
            CollectionRunnerService collectionRunnerService) {
        this.collectionRunnerService = collectionRunnerService;
    }

    @PostMapping("/{id}/run")
    public CollectionRunResult runCollection(@PathVariable Long id) {
        return collectionRunnerService.runCollection(id);
    }
}