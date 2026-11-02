
package com.apiatlas.controller;

import com.apiatlas.dto.BeneficiaryRegistrationRequest;
import com.apiatlas.entity.Beneficiary;
import com.apiatlas.repository.BeneficiaryRepository;
import com.apiatlas.dto.BeneficiaryStatusResponse;
import com.apiatlas.service.BeneficiaryService;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryRepository repository;
    private final BeneficiaryService service;

    public BeneficiaryController(BeneficiaryRepository repository,
                                 BeneficiaryService service) {
        this.repository = repository;
        this.service =service;
    }

    @PostMapping
    public ResponseEntity<?> register(
            @Valid @RequestBody BeneficiaryRegistrationRequest request) {

        if (repository.existsByClientReference(request.clientReference())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message", "Client reference already exists")
            );
        }

        Beneficiary beneficiary = new Beneficiary();
        beneficiary.setClientReference(request.clientReference());
        beneficiary.setBeneficiaryName(request.beneficiaryName());
        beneficiary.setBankName(request.bankName());

        String account = request.accountNumber();
        beneficiary.setAccountNumberMasked(
                "*".repeat(account.length() - 4) + account.substring(account.length() - 4)
        );

        beneficiary.setIfscCode(request.ifscCode());
        beneficiary.setRegistrationStatus("PENDING");

        Beneficiary saved = repository.save(beneficiary);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "beneficiaryId", saved.getId(),
                        "clientReference", saved.getClientReference(),
                        "status", saved.getRegistrationStatus(),
                        "message", "Beneficiary registration created"
                )
        );
    }

    @GetMapping("/{id}")
    public BeneficiaryStatusResponse getBeneficiaryStatus(
            @PathVariable Long id) {

        Beneficiary beneficiary = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Beneficiary not found with ID: " + id
                ));

        return new BeneficiaryStatusResponse(
                beneficiary.getId(),
                beneficiary.getClientReference(),
                beneficiary.getBeneficiaryName(),
                beneficiary.getBankName(),
                beneficiary.getAccountNumberMasked(),
                beneficiary.getIfscCode(),
                beneficiary.getRegistrationStatus(),
                beneficiary.getProviderReference(),
                beneficiary.getFailureReason(),
                beneficiary.getCreatedAt(),
                beneficiary.getUpdatedAt()
        );
    }

    @GetMapping
    public List<Beneficiary> getBeneficiaries(
            @RequestParam(required = false) String status) {
        return service.getBeneficiaries(status);
    }

}
