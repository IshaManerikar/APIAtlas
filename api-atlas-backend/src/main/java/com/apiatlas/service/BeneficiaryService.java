
package com.apiatlas.service;

import com.apiatlas.entity.Beneficiary;
import com.apiatlas.repository.BeneficiaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    public List<Beneficiary> getBeneficiaries(String status) {
        if (status == null || status.isBlank()) {
            return beneficiaryRepository.findAll();
        }

        return beneficiaryRepository.findByRegistrationStatus(
                status.trim().toUpperCase()
        );
    }
}
