package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.dto.EventDTO;
import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.Event.EventStatus;
import com.pvpsit.QREventManager.entity.User;
import com.pvpsit.QREventManager.repository.EventRepository;
import com.pvpsit.QREventManager.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public Event createEvent(Event event, User admin) {
        event.setCreatedBy(admin);
        event.setSubEvents(sanitizeSubEvents(event.getSubEvents()));
        normalizePricing(event);
        event.setStatus(EventStatus.ACTIVE);
        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, Event eventDetails) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setEventTime(eventDetails.getEventTime());
        event.setVenue(eventDetails.getVenue());
        event.setPrice(eventDetails.getPrice());
        event.setPvpsitPrice(eventDetails.getPvpsitPrice());
        event.setOtherCollegePrice(eventDetails.getOtherCollegePrice());
        event.setMaxSeats(eventDetails.getMaxSeats());
        event.setSubEvents(sanitizeSubEvents(eventDetails.getSubEvents()));
        normalizePricing(event);

        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(EventStatus.DELETED);
        eventRepository.save(event);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findActiveEvents().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getAllEventsForAdmin() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getUpcomingEvents() {
        return eventRepository.findActiveEventsByEventDateAfter(LocalDate.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDTO(event);
    }

    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setEventTime(event.getEventTime());
        dto.setVenue(event.getVenue());
        Double pvpsitPrice = firstNonNull(event.getPvpsitPrice(), event.getPrice(), 0.0);
        Double otherCollegePrice = firstNonNull(event.getOtherCollegePrice(), event.getPrice(), pvpsitPrice);
        dto.setPrice(pvpsitPrice);
        dto.setPvpsitPrice(pvpsitPrice);
        dto.setOtherCollegePrice(otherCollegePrice);
        dto.setMaxSeats(event.getMaxSeats());
        dto.setSubEvents(event.getSubEvents() == null ? Collections.emptyList() : event.getSubEvents());
        dto.setStatus(event.getStatus() == null ? EventStatus.ACTIVE.name() : event.getStatus().name());

        Long registrations = registrationRepository.countByEvent(event);
        dto.setTotalRegistrations(registrations);
        dto.setAvailableSeats(event.getMaxSeats() == null ? null : event.getMaxSeats() - registrations.intValue());

        return dto;
    }

    private List<String> sanitizeSubEvents(List<String> subEvents) {
        if (subEvents == null) {
            return Collections.emptyList();
        }

        Map<String, String> normalizedMap = new LinkedHashMap<>();
        for (String rawValue : subEvents) {
            if (rawValue == null || rawValue.trim().isEmpty()) {
                continue;
            }

            String cleaned = rawValue.trim();
            if ("NA".equalsIgnoreCase(cleaned)) {
                continue;
            }

            normalizedMap.putIfAbsent(cleaned.toLowerCase(Locale.ROOT), cleaned);
        }

        return List.copyOf(normalizedMap.values());
    }

    private void normalizePricing(Event event) {
        Double pvpsitPrice = firstNonNull(event.getPvpsitPrice(), event.getPrice(), 0.0);
        Double otherCollegePrice = firstNonNull(event.getOtherCollegePrice(), event.getPrice(), pvpsitPrice);

        event.setPvpsitPrice(pvpsitPrice);
        event.setOtherCollegePrice(otherCollegePrice);
        event.setPrice(pvpsitPrice);
    }

    @SafeVarargs
    private final <T> T firstNonNull(T... values) {
        for (T value : values) {
            if (value != null) {
                return value;
            }
        }
        return null;
    }
}
