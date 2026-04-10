package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.Attendance;
import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.QrCode;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.entity.SubEventAttendance;
import com.pvpsit.QREventManager.entity.SubEventQrCode;
import com.pvpsit.QREventManager.repository.AttendanceRepository;
import com.pvpsit.QREventManager.repository.QrCodeRepository;
import com.pvpsit.QREventManager.repository.SubEventAttendanceRepository;
import com.pvpsit.QREventManager.repository.SubEventQrCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final QrCodeRepository qrCodeRepository;
    private final SubEventAttendanceRepository subEventAttendanceRepository;
    private final SubEventQrCodeRepository subEventQrCodeRepository;

    @Transactional
    public SubEventAttendance scanQRCode(String qrData) {
        SubEventQrCode subEventQrCode = subEventQrCodeRepository.findByQrData(qrData).orElse(null);
        if (subEventQrCode == null) {
            // Backward compatibility: allow legacy single QR codes to still be scanned (treated as NA).
            QrCode legacyQrCode = qrCodeRepository.findByQrData(qrData)
                    .orElseThrow(() -> new RuntimeException("Invalid QR code"));
            return scanLegacyQr(legacyQrCode);
        }

        if (Boolean.TRUE.equals(subEventQrCode.getUsed())) {
            throw new RuntimeException("QR code already used");
        }

        Registration registration = subEventQrCode.getRegistration();
        String subEvent = subEventQrCode.getSubEvent();

        // Check if already marked present
        if (subEventAttendanceRepository.findByRegistrationAndSubEventIgnoreCase(registration, subEvent).isPresent()) {
            throw new RuntimeException("Attendance already marked for this sub-event");
        }

        // Mark attendance
        SubEventAttendance attendance = new SubEventAttendance();
        attendance.setRegistration(registration);
        attendance.setEvent(registration.getEvent());
        attendance.setSubEvent(subEvent);
        attendance.setScannedAt(LocalDateTime.now());
        attendance.setStatus(SubEventAttendance.AttendanceStatus.PRESENT);

        // Mark QR as used
        subEventQrCode.setUsed(true);
        subEventQrCodeRepository.save(subEventQrCode);

        return subEventAttendanceRepository.save(attendance);
    }

    public Long getEventAttendanceCount(Long eventId) {
        // Total sub-event attendances for the event (each sub-event scanned counts separately).
        return (long) subEventAttendanceRepository.findByEvent(new Event() {{ setEventId(eventId); }}).size();
    }

    private SubEventAttendance scanLegacyQr(QrCode legacyQrCode) {
        if (Boolean.TRUE.equals(legacyQrCode.getUsed())) {
            throw new RuntimeException("QR code already used");
        }

        Registration registration = legacyQrCode.getRegistration();
        String subEvent = "NA";

        if (subEventAttendanceRepository.findByRegistrationAndSubEventIgnoreCase(registration, subEvent).isPresent()) {
            throw new RuntimeException("Attendance already marked for this sub-event");
        }

        SubEventAttendance attendance = new SubEventAttendance();
        attendance.setRegistration(registration);
        attendance.setEvent(registration.getEvent());
        attendance.setSubEvent(subEvent);
        attendance.setScannedAt(LocalDateTime.now());
        attendance.setStatus(SubEventAttendance.AttendanceStatus.PRESENT);

        legacyQrCode.setUsed(true);
        qrCodeRepository.save(legacyQrCode);

        return subEventAttendanceRepository.save(attendance);
    }
}
