package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.*;
import com.pvpsit.QREventManager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public Registration registerForEvent(Long eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if already registered
        if (registrationRepository.findByEventAndUser(event, user).isPresent()) {
            throw new RuntimeException("Already registered for this event");
        }

        // Check seat availability
        Long currentRegistrations = registrationRepository.countByEvent(event);
        if (currentRegistrations >= event.getMaxSeats()) {
            throw new RuntimeException("Event is full");
        }

        // Create registration
        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setPaymentStatus(Registration.PaymentStatus.PENDING);
        registration.setRegStatus(Registration.RegistrationStatus.CONFIRMED);
        registration.setCreatedAt(LocalDateTime.now());

        return registrationRepository.save(registration);
    }

    public List<Registration> getUserRegistrations(User user) {
        return registrationRepository.findByUser(user);
    }

    public List<Registration> getEventRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return registrationRepository.findByEvent(event);
    }

    public Registration getRegistrationById(Long regId) {
        return registrationRepository.findById(regId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }

    @Transactional
    public void updatePaymentStatus(Long regId, Registration.PaymentStatus status) {
        Registration registration = getRegistrationById(regId);
        registration.setPaymentStatus(status);
        registrationRepository.save(registration);
    }
}
