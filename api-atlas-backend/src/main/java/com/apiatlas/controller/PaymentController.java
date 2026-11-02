package com.apiatlas.controller;

import com.apiatlas.dto.PaymentInitiationRequest;
import com.apiatlas.dto.PaymentResponse;
import com.apiatlas.service.PaymentService;
import com.apiatlas.dto.PaymentDetailsResponse;
import com.apiatlas.entity.Payment;
import com.apiatlas.repository.PaymentRepository;
import com.apiatlas.entity.Beneficiary;
import com.apiatlas.repository.BeneficiaryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final BeneficiaryRepository beneficiaryRepository;



    public PaymentController(
            PaymentService paymentService,
            PaymentRepository paymentRepository,
            BeneficiaryRepository beneficiaryRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.beneficiaryRepository = beneficiaryRepository;
    }


    @PostMapping
    public ResponseEntity<PaymentResponse> initiatePayment(
            @Valid @RequestBody PaymentInitiationRequest request,
            @RequestHeader(value = "Idempotency-Key", required = false)
            String idempotencyKey) {

        PaymentResponse response =
                paymentService.initiate(request, idempotencyKey);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/details")
    public PaymentDetailsResponse getPaymentDetails(@PathVariable Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Payment not found"));

        Beneficiary beneficiary = beneficiaryRepository
                .findById(payment.getBeneficiaryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Beneficiary not found"));

        return new PaymentDetailsResponse(
                payment.getId(),
                payment.getClientReference(),
                payment.getIdempotencyKey(),
                payment.getBeneficiaryId(),
                beneficiary.getBeneficiaryName(),
                beneficiary.getBankName(),
                beneficiary.getAccountNumberMasked(),
                beneficiary.getIfscCode(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                payment.getProviderReference(),
                payment.getUtr(),
                payment.getFailureReason(),
                payment.getInitiatedAt(),
                payment.getCompletedAt(),
                payment.getUpdatedAt()
        );
    }

    @GetMapping("/date")
    public List<PaymentDetailsResponse> getPaymentsByDate(
            @RequestParam
            @org.springframework.format.annotation.DateTimeFormat(
                    iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
            LocalDate date) {

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<Payment> payments =
                paymentRepository
                        .findByInitiatedAtGreaterThanEqualAndInitiatedAtLessThan(
                                start, end);

        return payments.stream().map(payment -> {
            Beneficiary beneficiary = beneficiaryRepository
                    .findById(payment.getBeneficiaryId())
                    .orElse(null);

            return new PaymentDetailsResponse(
                    payment.getId(),
                    payment.getClientReference(),
                    payment.getIdempotencyKey(),
                    payment.getBeneficiaryId(),
                    beneficiary != null ? beneficiary.getBeneficiaryName() : null,
                    beneficiary != null ? beneficiary.getBankName() : null,
                    beneficiary != null ? beneficiary.getAccountNumberMasked() : null,
                    beneficiary != null ? beneficiary.getIfscCode() : null,
                    payment.getAmount(),
                    payment.getCurrency(),
                    payment.getStatus(),
                    payment.getProviderReference(),
                    payment.getUtr(),
                    payment.getFailureReason(),
                    payment.getInitiatedAt(),
                    payment.getCompletedAt(),
                    payment.getUpdatedAt()
            );
        }).toList();
    }
    @GetMapping("/reference/{clientReference}")
    public PaymentDetailsResponse getByClientReference(
            @PathVariable String clientReference) {

        Payment payment = paymentService.getByClientReference(clientReference);

        Beneficiary beneficiary = beneficiaryRepository
                .findById(payment.getBeneficiaryId())
                .orElse(null);

        return new PaymentDetailsResponse(
                payment.getId(),
                payment.getClientReference(),
                payment.getIdempotencyKey(),
                payment.getBeneficiaryId(),
                beneficiary != null ? beneficiary.getBeneficiaryName() : null,
                beneficiary != null ? beneficiary.getBankName() : null,
                beneficiary != null ? beneficiary.getAccountNumberMasked() : null,
                beneficiary != null ? beneficiary.getIfscCode() : null,
                payment.getAmount(),
                payment.getCurrency(),
                payment.getStatus(),
                payment.getProviderReference(),
                payment.getUtr(),
                payment.getFailureReason(),
                payment.getInitiatedAt(),
                payment.getCompletedAt(),
                payment.getUpdatedAt()
        );
    }
}
