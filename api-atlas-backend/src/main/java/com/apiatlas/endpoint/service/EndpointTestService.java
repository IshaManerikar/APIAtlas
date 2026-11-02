
package com.apiatlas.endpoint.service;

import com.apiatlas.endpoint.dto.EndpointTestResult;
import com.apiatlas.endpoint.entity.EndpointTestHistory;
import com.apiatlas.endpoint.entity.MonitoredEndpoint;
import com.apiatlas.endpoint.repository.EndpointTestHistoryRepository;
import com.apiatlas.endpoint.repository.MonitoredEndpointRepository;
import com.apiatlas.notification.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class EndpointTestService {

    private final MonitoredEndpointRepository repository;
    private final EndpointTestHistoryRepository historyRepository;
    private final NotificationService notificationService;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

    public EndpointTestService(
            MonitoredEndpointRepository repository,
            EndpointTestHistoryRepository historyRepository,
            NotificationService notificationService) {
        this.repository = repository;
        this.historyRepository = historyRepository;
        this.notificationService = notificationService;
    }

    public EndpointTestResult testEndpoint(Long id) {
        MonitoredEndpoint endpoint = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        NOT_FOUND, "Endpoint not found: " + id));

        String url = endpoint.getUrl();
        String method = endpoint.getMethod() == null
                ? "GET"
                : endpoint.getMethod().toUpperCase(Locale.ROOT);

        Instant testedAt = Instant.now();
        long start = System.nanoTime();

        try {
            URI uri = URI.create(url);

            if (!("http".equalsIgnoreCase(uri.getScheme())
                    || "https".equalsIgnoreCase(uri.getScheme()))
                    || uri.getHost() == null) {
                throw new IllegalArgumentException(
                        "Only valid HTTP and HTTPS URLs are supported.");
            }

            if (!method.matches("GET|POST|PUT|PATCH|DELETE")) {
                throw new IllegalArgumentException(
                        "Unsupported HTTP method: " + method);
            }


            String requestBody = endpoint.getRequestBody();

            HttpRequest.BodyPublisher bodyPublisher;

            if (requestBody != null && !requestBody.isBlank()) {
                bodyPublisher = HttpRequest.BodyPublishers.ofString(
                        requestBody,
                        StandardCharsets.UTF_8
                );
            } else {
                bodyPublisher = HttpRequest.BodyPublishers.noBody();
            }

            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                    .uri(uri)
                    .timeout(Duration.ofSeconds(10))
                    .header("Accept", "*/*");

            if (requestBody != null && !requestBody.isBlank()) {
                requestBuilder.header("Content-Type", "application/json");
            }

            HttpRequest request = requestBuilder
                    .method(method, bodyPublisher)
                    .build();
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );


            long durationMs = Duration.ofNanos(
                    System.nanoTime() - start).toMillis();

            String body = response.body();
            if (body != null && body.length() > 5000) {
                body = body.substring(0, 5000)
                        + "\n... response truncated";
            }

            int statusCode = response.statusCode();
            boolean success = statusCode >= 200 && statusCode < 400;

            // Update the endpoint's current status.
            String previousStatus = endpoint.getStatus();
            String newStatus = success ? "OPERATIONAL" : "DOWN";

            endpoint.setStatus(newStatus);
            repository.save(endpoint);

            notificationService.createEndpointNotification(
                    endpoint.getId(),
                    endpoint.getName(),
                    previousStatus,
                    newStatus
            );

            EndpointTestResult result = new EndpointTestResult(
                    endpoint.getId(),
                    endpoint.getName(),
                    url,
                    method,
                    statusCode,
                    durationMs,
                    success,
                    body,
                    null,
                    testedAt
            );

            saveHistory(result);
            return result;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            return failure(endpoint, url, method, start, testedAt,
                    "Request was interrupted.");

        } catch (Exception e) {
            return failure(endpoint, url, method, start, testedAt,
                    e.getMessage() == null
                            ? "Request failed."
                            : e.getMessage());
        }
    }

    private EndpointTestResult failure(
            MonitoredEndpoint endpoint,
            String url,
            String method,
            long start,
            Instant testedAt,
            String errorMessage) {

        long durationMs = Duration.ofNanos(
                System.nanoTime() - start).toMillis();

        String previousStatus = endpoint.getStatus();

        endpoint.setStatus("DOWN");
        repository.save(endpoint);

        notificationService.createEndpointNotification(
                endpoint.getId(),
                endpoint.getName(),
                previousStatus,
                "DOWN"
        );

        EndpointTestResult result = new EndpointTestResult(
                endpoint.getId(),
                endpoint.getName(),
                url,
                method,
                null,
                durationMs,
                false,
                null,
                errorMessage,
                testedAt
        );

        saveHistory(result);
        return result;

    }
    private void saveHistory(EndpointTestResult result) {
        EndpointTestHistory history = new EndpointTestHistory();

        history.setEndpointId(result.endpointId());
        history.setStatusCode(result.statusCode());
        history.setDurationMs(result.durationMs());
        history.setSuccess(result.success());
        history.setResponseBody(result.responseBody());
        history.setErrorMessage(result.errorMessage());
        history.setTestedAt(result.testedAt());

        historyRepository.save(history);
    }
}
