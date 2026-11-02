
package com.apiatlas.repository;

import com.apiatlas.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByIdempotencyKey(String idempotencyKey);

    boolean existsByClientReference(String clientReference);

    List<Payment> findByInitiatedAtGreaterThanEqualAndInitiatedAtLessThan(
            LocalDateTime start,
            LocalDateTime end
    );

    Optional<Payment> findByClientReference(String clientReference);
}
