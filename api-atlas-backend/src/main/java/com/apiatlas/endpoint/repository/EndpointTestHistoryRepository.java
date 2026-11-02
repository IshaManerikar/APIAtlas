package com.apiatlas.endpoint.repository;

import com.apiatlas.endpoint.entity.EndpointTestHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EndpointTestHistoryRepository
        extends JpaRepository<EndpointTestHistory, Long> {

    List<EndpointTestHistory> findByEndpointIdOrderByTestedAtDesc(
            Long endpointId
    );
}