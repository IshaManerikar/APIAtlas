package com.apiatlas.repository;

import com.apiatlas.entity.ApiCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApiCollectionRepository
        extends JpaRepository<ApiCollection, Long> {

    boolean existsByNameIgnoreCase(String name);

    @Query("""
        SELECT DISTINCT c
        FROM ApiCollection c
        LEFT JOIN FETCH c.endpoints
        """)
    List<ApiCollection> findAllWithEndpoints();

    @Query("""
        SELECT DISTINCT c
        FROM ApiCollection c
        LEFT JOIN FETCH c.endpoints
        WHERE c.id = :id
        """)
    Optional<ApiCollection> findByIdWithEndpoints(@Param("id") Long id);
}