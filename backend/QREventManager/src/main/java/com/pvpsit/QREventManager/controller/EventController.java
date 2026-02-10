package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.service.EventServiceImplementation;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class EventController {
    private EventServiceImplementation eventServiceImplementation;
    @PostMapping("/new-event")
    public ResponseEntity<String> createEvent(@RequestBody Event event){
        return new ResponseEntity<>(eventServiceImplementation.createEvent(event), HttpStatus.CREATED);

    }

}
