
package com.apiatlas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "beneficiaries",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_beneficiary_client_reference",
                        columnNames = "client_reference"
                )
        }
)
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_reference", nullable = false, unique = true, length = 64)
    private String clientReference;

    @Column(name = "beneficiary_name", nullable = false, length = 150)
    private String beneficiaryName;

    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @Column(name = "account_number_masked", nullable = false, length = 30)
    private String accountNumberMasked;

    @Column(name = "account_token", length = 255)
    private String accountToken;

    @Column(name = "ifsc_code", nullable = false, length = 11)
    private String ifscCode;

    @Column(name = "registration_status", nullable = false, length = 30)
    private String registrationStatus;

    @Column(name = "provider_reference", length = 100)
    private String providerReference;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getClientReference() { return clientReference; }
    public String getBeneficiaryName() { return beneficiaryName; }
    public String getBankName() { return bankName; }
    public String getAccountNumberMasked() { return accountNumberMasked; }
    public String getAccountToken() { return accountToken; }
    public String getIfscCode() { return ifscCode; }
    public String getRegistrationStatus() { return registrationStatus; }
    public String getProviderReference() { return providerReference; }
    public String getFailureReason() { return failureReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setClientReference(String value) { clientReference = value; }
    public void setBeneficiaryName(String value) { beneficiaryName = value; }
    public void setBankName(String value) { bankName = value; }
    public void setAccountNumberMasked(String value) { accountNumberMasked = value; }
    public void setAccountToken(String value) { accountToken = value; }
    public void setIfscCode(String value) { ifscCode = value; }
    public void setRegistrationStatus(String value) { registrationStatus = value; }
    public void setProviderReference(String value) { providerReference = value; }
    public void setFailureReason(String value) { failureReason = value; }
}
