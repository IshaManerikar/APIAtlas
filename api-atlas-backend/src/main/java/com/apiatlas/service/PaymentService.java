package com.apiatlas.service;

import com.apiatlas.dto.PaymentInitiationRequest;
import com.apiatlas.dto.PaymentResponse;
import com.apiatlas.entity.Beneficiary;
import com.apiatlas.entity.Payment;
import com.apiatlas.repository.BeneficiaryRepository;
import com.apiatlas.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BeneficiaryRepository beneficiaryRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            BeneficiaryRepository beneficiaryRepository) {
        this.paymentRepository = paymentRepository;
        this.beneficiaryRepository = beneficiaryRepository;
    }

    @Transactional
    public PaymentResponse initiate(
            PaymentInitiationRequest request,
            String idempotencyKey) {

        if (idempotencyKey == null || idempotencyKey.isBlank()
                || idempotencyKey.length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A valid Idempotency-Key header is required");
        }

        var existing = paymentRepository.findByIdempotencyKey(idempotencyKey);

        if (existing.isPresent()) {
            Payment payment = existing.get();

            if (!payment.getClientReference().equals(request.clientReference())
                    || !payment.getBeneficiaryId().equals(request.beneficiaryId())
                    || payment.getAmount().compareTo(request.amount()) != 0
                    || !payment.getCurrency().equals(request.currency())
                    ) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Idempotency key was already used with a different request");
            }

            return toResponse(payment);
        }

        if (paymentRepository.existsByClientReference(request.clientReference())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Payment client reference already exists");
        }

        Beneficiary beneficiary = beneficiaryRepository.findById(request.beneficiaryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Beneficiary not found"));

        if (!"ACTIVE".equals(beneficiary.getRegistrationStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payments can only be initiated for ACTIVE beneficiaries");
        }

        Payment payment = new Payment();
        payment.setClientReference(request.clientReference());
        payment.setBeneficiaryId(request.beneficiaryId());
        payment.setAmount(request.amount());
        payment.setCurrency(request.currency());
        payment.setIdempotencyKey(idempotencyKey);
        payment.setStatus("INITIATED");

        return toResponse(paymentRepository.save(payment));
    }

    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getClientReference(),
                payment.getBeneficiaryId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                payment.getProviderReference()
        );
    }

    public Payment getByClientReference(String clientReference) {
        return paymentRepository.findByClientReference(clientReference)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Payment not found for client reference: " + clientReference
                ));
    }
}

