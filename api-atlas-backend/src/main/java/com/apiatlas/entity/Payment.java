
package com.apiatlas.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "payments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_payment_client_reference",
                        columnNames = "client_reference"
                ),
                @UniqueConstraint(
                        name = "uk_payment_idempotency_key",
                        columnNames = "idempotency_key"
                )
        }
)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_reference", nullable = false, length = 64)
    private String clientReference;

    @Column(name = "idempotency_key", nullable = false, length = 100)
    private String idempotencyKey;

    @Column(name = "beneficiary_id", nullable = false)
    private Long beneficiaryId;

    @Column(name = "amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "payment_status", nullable = false, length = 30)
    private String status;

    @Column(name = "provider_reference", length = 100)
    private String providerReference;

    @Column(name = "utr", length = 100)
    private String utr;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "initiated_at")
    private LocalDateTime initiatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Version
    @Column(name = "version")
    private Long version;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        initiatedAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getClientReference() { return clientReference; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public Long getBeneficiaryId() { return beneficiaryId; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getStatus() { return status; }
    public String getProviderReference() { return providerReference; }
    public String getUtr() { return utr; }
    public String getFailureReason() { return failureReason; }
    public LocalDateTime getInitiatedAt() { return initiatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getVersion() { return version; }

    public void setClientReference(String value) { clientReference = value; }
    public void setIdempotencyKey(String value) { idempotencyKey = value; }
    public void setBeneficiaryId(Long value) { beneficiaryId = value; }
    public void setAmount(BigDecimal value) { amount = value; }
    public void setCurrency(String value) { currency = value; }
    public void setStatus(String value) { status = value; }
    public void setProviderReference(String value) { providerReference = value; }
    public void setUtr(String value) { utr = value; }
    public void setFailureReason(String value) { failureReason = value; }
    public void setCompletedAt(LocalDateTime value) { completedAt = value; }
}
