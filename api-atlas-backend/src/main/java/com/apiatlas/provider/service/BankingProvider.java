package com.apiatlas.provider.service;

import com.apiatlas.provider.dto.ProviderRegistrationResult;

public interface BankingProvider {

    ProviderRegistrationResult registerBeneficiary(
            String clientReference,
            String beneficiaryName,
            String accountNumber,
            String ifscCode);
}