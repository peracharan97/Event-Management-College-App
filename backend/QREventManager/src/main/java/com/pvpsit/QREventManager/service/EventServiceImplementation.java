package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.repository.EventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class EventServiceImplementation implements EventService {
    private EventRepository eventRepository;

    @Override
    public String createEvent(Event event) {
        try{
            eventRepository.save(event);
            return "Event Created";
        } catch (Exception e) {
            return "Error"+e;
        }

    }

    @Override
    public List<Event> getEvents() {
        try {
            return eventRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
