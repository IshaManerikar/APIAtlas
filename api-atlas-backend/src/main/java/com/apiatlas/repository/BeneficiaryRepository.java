
package com.apiatlas.repository;

import com.apiatlas.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository
        extends JpaRepository<Beneficiary, Long> {

    boolean existsByClientReference(String clientReference);

    Optional<Beneficiary> findByClientReference(String clientReference);

    List<Beneficiary> findAll();

    List<Beneficiary> findByRegistrationStatus(String registrationStatus);

}
