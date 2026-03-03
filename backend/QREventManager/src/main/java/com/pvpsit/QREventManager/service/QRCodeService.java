package com.pvpsit.QREventManager.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.pvpsit.QREventManager.entity.QrCode;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.repository.QrCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class QRCodeService {

    private final QrCodeRepository qrCodeRepository;

    public QrCode generateQRCode(Registration registration) {
        try {
            // Create QR data
            String qrData = String.format(
                    "PVPSIT_EVENT|REG:%d|EVENT:%d|USER:%s|TIME:%s",
                    registration.getRegId(),
                    registration.getEvent().getEventId(),
                    registration.getUser().getEmail(),
                    LocalDateTime.now()
            );

            // Generate QR code image
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 300, 300);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(pngData);

            // Upsert avoids duplicate-key failures when payment verification callback is retried.
            QrCode qrCode = qrCodeRepository.findByRegistration(registration)
                    .orElseGet(() -> {
                        QrCode newQrCode = new QrCode();
                        newQrCode.setRegistration(registration);
                        return newQrCode;
                    });
            qrCode.setQrData(qrData);
            qrCode.setQrImageBase64(base64Image);
            qrCode.setGeneratedAt(LocalDateTime.now());
            qrCode.setUsed(false);

            return qrCodeRepository.save(qrCode);
        } catch (Exception e) {
            throw new RuntimeException("QR code generation failed", e);
        }
    }

    public QrCode getQRCodeByRegistration(Long regId) {
        return qrCodeRepository.findByRegistration_RegId(regId)
                .orElseThrow(() -> new RuntimeException("QR code not found"));
    }


    public boolean validateAndMarkUsed(String qrData) {
        return qrCodeRepository.findByQrData(qrData)
                .map(qrCode -> {
                    if (qrCode.getUsed()) {
                        return false;
                    }
                    qrCode.setUsed(true);
                    qrCodeRepository.save(qrCode);
                    return true;
                })
                .orElse(false);
    }
}
