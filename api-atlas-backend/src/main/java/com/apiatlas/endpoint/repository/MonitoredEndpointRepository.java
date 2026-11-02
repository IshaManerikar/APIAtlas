
package com.apiatlas.endpoint.repository;

import com.apiatlas.endpoint.entity.MonitoredEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonitoredEndpointRepository
        extends JpaRepository<MonitoredEndpoint, Long> {
}
