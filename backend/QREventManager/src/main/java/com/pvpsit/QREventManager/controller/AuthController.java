package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.dto.AuthRequest;
import com.pvpsit.QREventManager.dto.AuthResponse;
import com.pvpsit.QREventManager.dto.RegisterRequest;
import com.pvpsit.QREventManager.dto.UpdateProfileRequest;
import com.pvpsit.QREventManager.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request,
                                                      Authentication authentication) {
        return ResponseEntity.ok(authService.updateProfile(authentication.getName(), request));
    }
}
