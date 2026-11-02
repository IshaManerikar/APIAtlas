package com.apiatlas.endpoint.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "endpoint_test_history")
public class EndpointTestHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "endpoint_id", nullable = false)
    private Long endpointId;

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(name = "duration_ms", nullable = false)
    private long durationMs;

    @Column(nullable = false)
    private boolean success;

    @Column(name = "response_body", columnDefinition = "TEXT")
    private String responseBody;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "tested_at", nullable = false)
    private Instant testedAt;

    public EndpointTestHistory() {}

    public Long getId() { return id; }
    public Long getEndpointId() { return endpointId; }
    public Integer getStatusCode() { return statusCode; }
    public long getDurationMs() { return durationMs; }
    public boolean isSuccess() { return success; }
    public String getResponseBody() { return responseBody; }
    public String getErrorMessage() { return errorMessage; }
    public Instant getTestedAt() { return testedAt; }

    public void setEndpointId(Long endpointId) { this.endpointId = endpointId; }
    public void setStatusCode(Integer statusCode) { this.statusCode = statusCode; }
    public void setDurationMs(long durationMs) { this.durationMs = durationMs; }
    public void setSuccess(boolean success) { this.success = success; }
    public void setResponseBody(String responseBody) { this.responseBody = responseBody; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public void setTestedAt(Instant testedAt) { this.testedAt = testedAt; }
}