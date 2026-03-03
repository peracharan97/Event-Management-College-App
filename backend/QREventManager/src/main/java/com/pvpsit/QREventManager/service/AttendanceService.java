package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.entity.Attendance;
import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.QrCode;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.repository.AttendanceRepository;
import com.pvpsit.QREventManager.repository.QrCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final QrCodeRepository qrCodeRepository;

    @Transactional
    public Attendance scanQRCode(String qrData) {
        QrCode qrCode = qrCodeRepository.findByQrData(qrData)
                .orElseThrow(() -> new RuntimeException("Invalid QR code"));

        if (qrCode.getUsed()) {
            throw new RuntimeException("QR code already used");
        }

        Registration registration = qrCode.getRegistration();

        // Check if already marked present
        if (attendanceRepository.findByRegistration(registration).isPresent()) {
            throw new RuntimeException("Attendance already marked");
        }

        // Mark attendance
        Attendance attendance = new Attendance();
        attendance.setRegistration(registration);
        attendance.setEvent(registration.getEvent());
        attendance.setScannedAt(LocalDateTime.now());
        attendance.setStatus(Attendance.AttendanceStatus.PRESENT);

        // Mark QR as used
        qrCode.setUsed(true);
        qrCodeRepository.save(qrCode);

        return attendanceRepository.save(attendance);
    }

    public Long getEventAttendanceCount(Long eventId) {
        return attendanceRepository.countByEvent(
                new Event() {{ setEventId(eventId); }}
        );
    }
}