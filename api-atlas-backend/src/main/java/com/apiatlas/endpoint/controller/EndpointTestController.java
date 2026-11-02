package com.apiatlas.endpoint.controller;

import com.apiatlas.endpoint.dto.EndpointTestResult;
import com.apiatlas.endpoint.service.EndpointTestService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/endpoints")
public class EndpointTestController {

    private final EndpointTestService endpointTestService;

    public EndpointTestController(
            EndpointTestService endpointTestService) {
        this.endpointTestService = endpointTestService;
    }

    @PostMapping("/{id}/test")
    public EndpointTestResult testEndpoint(@PathVariable Long id) {
        return endpointTestService.testEndpoint(id);
    }
}