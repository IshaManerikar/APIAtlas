package com.apiatlas.repository;

import com.apiatlas.entity.Incident;
import com.apiatlas.entity.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findAllByOrderByCreatedAtDesc();

    List<Incident> findByStatusOrderByCreatedAtDesc(IncidentStatus status);
}