package com.pvpsit.QREventManager.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.pvpsit.QREventManager.entity.QrCode;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.entity.SubEventQrCode;
import com.pvpsit.QREventManager.repository.QrCodeRepository;
import com.pvpsit.QREventManager.repository.SubEventQrCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QRCodeService {

    private final QrCodeRepository qrCodeRepository;
    private final SubEventQrCodeRepository subEventQrCodeRepository;

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

    public List<SubEventQrCode> generateSubEventQRCodes(Registration registration) {
        if (registration == null || registration.getRegId() == null) {
            throw new RuntimeException("Invalid registration for QR generation");
        }

        List<String> subEvents = registration.getSelectedSubEvents() == null
                ? List.of("NA")
                : registration.getSelectedSubEvents().stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .distinct()
                .toList();

        if (subEvents.isEmpty()) {
            subEvents = List.of("NA");
        }

        return subEvents.stream()
                .map(subEvent -> upsertSubEventQr(registration, subEvent))
                .toList();
    }

    public List<SubEventQrCode> getSubEventQRCodesByRegistration(Long regId) {
        return subEventQrCodeRepository.findAllByRegistration_RegIdOrderBySubEventAsc(regId);
    }

    private SubEventQrCode upsertSubEventQr(Registration registration, String subEvent) {
        String safeSubEvent = subEvent == null || subEvent.trim().isEmpty() ? "NA" : subEvent.trim();

        SubEventQrCode qrCode = subEventQrCodeRepository.findByRegistration_RegIdAndSubEvent(registration.getRegId(), safeSubEvent)
                .orElseGet(() -> {
                    SubEventQrCode created = new SubEventQrCode();
                    created.setRegistration(registration);
                    created.setSubEvent(safeSubEvent);
                    created.setQrData(buildSubEventQrData(registration, safeSubEvent));
                    created.setUsed(false);
                    return created;
                });

        // Preserve existing qrData + used flag if we’re regenerating after retries.
        String qrData = qrCode.getQrData();
        qrCode.setQrImageBase64(generateQrImageBase64(qrData));
        qrCode.setGeneratedAt(LocalDateTime.now());

        return subEventQrCodeRepository.save(qrCode);
    }

    private String buildSubEventQrData(Registration registration, String subEvent) {
        String subEventEncoded = encodeQrPart(subEvent);
        String token = UUID.randomUUID().toString();
        return String.format(
                "PVPSIT_EVENT|REG:%d|EVENT:%d|SUB:%s|TOKEN:%s",
                registration.getRegId(),
                registration.getEvent().getEventId(),
                subEventEncoded,
                token
        );
    }

    private String encodeQrPart(String value) {
        if (value == null) {
            return "";
        }
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String generateQrImageBase64(String qrData) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            return Base64.getEncoder().encodeToString(pngData);
        } catch (Exception e) {
            throw new RuntimeException("QR code generation failed", e);
        }
    }
}
