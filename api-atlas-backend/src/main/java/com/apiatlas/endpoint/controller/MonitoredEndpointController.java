
package com.apiatlas.endpoint.controller;

import com.apiatlas.endpoint.entity.MonitoredEndpoint;
import com.apiatlas.endpoint.service.MonitoredEndpointService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/endpoints")
public class MonitoredEndpointController {

    private final MonitoredEndpointService service;

    public MonitoredEndpointController(
            MonitoredEndpointService service) {
        this.service = service;
    }

    public record CreateEndpointRequest(
            @NotBlank
            @Size(max = 100)
            String name,

            @NotBlank
            @Size(max = 500)
            @Pattern(
                    regexp = "(?i)^https?://.+",
                    message = "URL must start with http:// or https://"
            )
            String url,

            @Pattern(
                    regexp = "(?i)GET|POST|PUT|PATCH|DELETE",
                    message = "Unsupported HTTP method"
            )
            String method,
            String requestBody
    ) {}

    @GetMapping
    public List<MonitoredEndpoint> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public MonitoredEndpoint getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MonitoredEndpoint create(
            @Valid @RequestBody CreateEndpointRequest request) {

        MonitoredEndpoint endpoint = new MonitoredEndpoint();
        endpoint.setName(request.name().trim());
        endpoint.setUrl(request.url().trim());
        endpoint.setMethod(
                request.method() == null || request.method().isBlank()
                        ? "GET"
                        : request.method().trim().toUpperCase()
        );

        endpoint.setRequestBody(request.requestBody());
        return service.create(endpoint);
    }

    @PutMapping("/update/{id}")
    public MonitoredEndpoint update(
            @PathVariable Long id,
            @Valid @RequestBody CreateEndpointRequest request
    ) {
        MonitoredEndpoint endpoint = new MonitoredEndpoint();

        endpoint.setName(request.name().trim());
        endpoint.setUrl(request.url().trim());
        endpoint.setMethod(
                request.method() == null || request.method().isBlank()
                        ? "GET"
                        : request.method().trim().toUpperCase()
        );
        endpoint.setRequestBody(request.requestBody());

        return service.update(id, endpoint);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
