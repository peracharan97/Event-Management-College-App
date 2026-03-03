package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.entity.User;
import com.pvpsit.QREventManager.repository.EventRepository;
import com.pvpsit.QREventManager.repository.PaymentRepository;
import com.pvpsit.QREventManager.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String NOT_APPLICABLE = "NA";

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public Registration registerForEvent(Long eventId, User user, List<String> selectedSubEvents) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (registrationRepository.findByEventAndUser(event, user).isPresent()) {
            throw new RuntimeException("Already registered for this event");
        }

        Long currentRegistrations = registrationRepository.countByEvent(event);
        if (currentRegistrations >= event.getMaxSeats()) {
            throw new RuntimeException("Event is full");
        }

        List<String> normalizedSubEvents = normalizeSelection(event, selectedSubEvents);

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setSelectedSubEvents(normalizedSubEvents);
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

    private List<String> normalizeSelection(Event event, List<String> selectedSubEvents) {
        List<String> cleanedSelections = selectedSubEvents == null
                ? Collections.emptyList()
                : selectedSubEvents.stream()
                .filter(name -> name != null && !name.trim().isEmpty())
                .map(String::trim)
                .distinct()
                .collect(Collectors.toList());

        if (cleanedSelections.isEmpty()) {
            return List.of(NOT_APPLICABLE);
        }

        boolean selectedNA = cleanedSelections.stream().anyMatch(name -> NOT_APPLICABLE.equalsIgnoreCase(name));
        if (selectedNA) {
            return List.of(NOT_APPLICABLE);
        }

        List<String> eventSubEvents = event.getSubEvents() == null ? Collections.emptyList() : event.getSubEvents();
        if (eventSubEvents.isEmpty()) {
            throw new RuntimeException("This event does not have sub-events. Select NA.");
        }

        Set<String> allowed = eventSubEvents.stream()
                .map(value -> value.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        boolean allValid = cleanedSelections.stream()
                .map(value -> value.toLowerCase(Locale.ROOT))
                .allMatch(allowed::contains);

        if (!allValid) {
            throw new RuntimeException("Invalid sub-event selection.");
        }

        return cleanedSelections;
    }
}
