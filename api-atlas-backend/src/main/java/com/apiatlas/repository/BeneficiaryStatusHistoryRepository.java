package com.apiatlas.repository;

import com.apiatlas.entity.BeneficiaryStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BeneficiaryStatusHistoryRepository
        extends JpaRepository<BeneficiaryStatusHistory, Long> {
}