package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.dto.RegistrationRequest;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.entity.User;
import com.pvpsit.QREventManager.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<Registration> registerForEvent(
            @RequestBody RegistrationRequest request,
            @AuthenticationPrincipal User user
    ) {
        Registration registration = registrationService.registerForEvent(
                request.getEventId(),
                user
        );
        return ResponseEntity.ok(registration);
    }

    @GetMapping("/my-registrations")
    public ResponseEntity<List<Registration>> getMyRegistrations(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(registrationService.getUserRegistrations(user));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Registration>> getEventRegistrations(
            @PathVariable Long eventId
    ) {
        return ResponseEntity.ok(registrationService.getEventRegistrations(eventId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Registration> getRegistration(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.getRegistrationById(id));
    }
}