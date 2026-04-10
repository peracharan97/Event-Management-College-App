package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.entity.SubEventQrCode;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.service.QRCodeService;
import com.pvpsit.QREventManager.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QRCodeController {

    private final QRCodeService qrCodeService;
    private final RegistrationService registrationService;

    @GetMapping("/registration/{regId}")
    public ResponseEntity<List<SubEventQrCode>> getQRCode(@PathVariable Long regId) {
        List<SubEventQrCode> qrCodes = qrCodeService.getSubEventQRCodesByRegistration(regId);
        if (!qrCodes.isEmpty()) {
            return ResponseEntity.ok(qrCodes);
        }

        Registration registration = registrationService.getRegistrationById(regId);
        if (Registration.PaymentStatus.PAID.equals(registration.getPaymentStatus())) {
            return ResponseEntity.ok(qrCodeService.generateSubEventQRCodes(registration));
        }

        return ResponseEntity.ok(qrCodes);
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateQRCode(@RequestBody Map<String, String> request) {
        String qrData = request.get("qrData");
        return ResponseEntity.ok(qrCodeService.validateAndMarkUsed(qrData));
    }
}
