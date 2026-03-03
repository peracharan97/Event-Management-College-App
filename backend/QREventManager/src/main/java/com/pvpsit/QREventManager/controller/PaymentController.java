package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.dto.PaymentRequest;
import com.pvpsit.QREventManager.dto.PaymentResponse;
import com.pvpsit.QREventManager.dto.PaymentVerificationRequest;
import com.pvpsit.QREventManager.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiatePayment(
            @RequestBody PaymentRequest request
    ) {
        return ResponseEntity.ok(paymentService.initiatePayment(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyPayment(
            @RequestBody PaymentVerificationRequest request
    ) {
        paymentService.verifyPayment(request);
        return ResponseEntity.ok(Map.of("message", "Payment verified"));
    }
}
