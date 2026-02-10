package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.Event;

import java.util.List;

public interface EventService {
    String createEvent(Event event);
    List<Event> getEvents();


}
