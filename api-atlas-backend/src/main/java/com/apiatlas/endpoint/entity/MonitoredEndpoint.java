package com.apiatlas.endpoint.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "monitored_endpoints")
public class MonitoredEndpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(nullable = false, length = 10)
    private String method = "GET";

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String requestBody;


    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getRequestBody() { return requestBody; }

    public void setRequestBody(String requestBody) {
        this.requestBody = requestBody;
    }
}

