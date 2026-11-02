package com.apiatlas.provider.service;

import com.apiatlas.provider.dto.ProviderRegistrationResult;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SimulatedBankingProvider implements BankingProvider {

    @Override
    public ProviderRegistrationResult registerBeneficiary(
            String clientReference,
            String beneficiaryName,
            String accountNumber,
            String ifscCode) {

        // Demo-only scenarios for deterministic API testing.
        if (accountNumber.endsWith("0000")) {
            return new ProviderRegistrationResult(
                    "FAILED",
                    "SIM-" + UUID.randomUUID(),
                    null,
                    "Simulated bank rejected the registration"
            );
        }

        if (accountNumber.endsWith("9999")) {
            return new ProviderRegistrationResult(
                    "PENDING",
                    "SIM-" + UUID.randomUUID(),
                    null,
                    null
            );
        }

        return new ProviderRegistrationResult(
                "ACTIVE",
                "SIM-" + UUID.randomUUID(),
                "SIM-TOKEN-" + UUID.randomUUID(),
                null
        );
    }
}