package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.dto.*;
import com.pvpsit.QREventManager.entity.User;
import com.pvpsit.QREventManager.repository.UserRepository;
import com.pvpsit.QREventManager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ================= REGISTER =================
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already exists");

        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRollNo(request.getRollNo());
        user.setDepartment(request.getDepartment());
        user.setSemester(request.getSemester());
        user.setPhoneNumber(request.getPhoneNumber());

        // ✅ role assignment
        user.setRole(
                "ADMIN".equals(request.getRole())
                        ? User.Role.ADMIN
                        : User.Role.STUDENT
        );

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return buildResponse(user, token);
    }

    // ================= LOGIN =================
    public AuthResponse login(AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return buildResponse(user, token);
    }

    // ================= HELPER =================
    private AuthResponse buildResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName()
        );
    }
}
