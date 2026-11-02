package com.apiatlas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiary_status_history")
public class BeneficiaryStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "beneficiary_id", nullable = false)
    private Long beneficiaryId;

    @Column(name = "previous_status")
    private String previousStatus;

    @Column(name = "new_status", nullable = false)
    private String newStatus;

    @Column(name = "change_source", nullable = false)
    private String changeSource;

    @Column(name = "reason")
    private String reason;

    @Column(name = "correlation_id")
    private String correlationId;

    @Column(name = "changed_at", insertable = false, updatable = false)
    private LocalDateTime changedAt;

    protected BeneficiaryStatusHistory() {}

    public BeneficiaryStatusHistory(
            Long beneficiaryId,
            String previousStatus,
            String newStatus,
            String changeSource,
            String reason,
            String correlationId) {
        this.beneficiaryId = beneficiaryId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changeSource = changeSource;
        this.reason = reason;
        this.correlationId = correlationId;
    }
}