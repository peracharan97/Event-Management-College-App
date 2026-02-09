package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.repository.EventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
@AllArgsConstructor
@Service
public class EventServiceImplementation implements EventService {
    private EventRepository eventRepository;

    @Override
    public String addEvent(Event event) {
        try{
            eventRepository.save(event);
            return "Event Created";
        } catch (Exception e) {
            return "Error"+e;
        }

    }
}
