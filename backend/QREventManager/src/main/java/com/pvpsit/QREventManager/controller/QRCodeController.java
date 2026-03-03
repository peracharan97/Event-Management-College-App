package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.entity.QrCode;
import com.pvpsit.QREventManager.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QRCodeController {

    private final QRCodeService qrCodeService;

    @GetMapping("/registration/{regId}")
    public ResponseEntity<QrCode> getQRCode(@PathVariable Long regId) {
        return ResponseEntity.ok(qrCodeService.getQRCodeByRegistration(regId));
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateQRCode(@RequestBody Map<String, String> request) {
        String qrData = request.get("qrData");
        return ResponseEntity.ok(qrCodeService.validateAndMarkUsed(qrData));
    }
}