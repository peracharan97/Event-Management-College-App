package com.pvpsit.QREventManager.repository;

import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEvent(Event event);
    List<Registration> findByUser(User user);
    Optional<Registration> findByEventAndUser(Event event, User user);
    Long countByEvent(Event event);
    Long countByEventAndPaymentStatus(Event event, Registration.PaymentStatus status);
}