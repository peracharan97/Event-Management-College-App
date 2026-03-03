package com.pvpsit.QREventManager.repository;


import com.pvpsit.QREventManager.entity.Payment;
import com.pvpsit.QREventManager.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByOrderId(String orderId);
    Optional<Payment> findByRegistration(Registration registration);
}