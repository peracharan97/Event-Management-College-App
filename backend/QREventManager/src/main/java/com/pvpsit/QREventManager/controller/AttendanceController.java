package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.dto.AttendanceScanResponse;
import com.pvpsit.QREventManager.entity.Attendance;
import com.pvpsit.QREventManager.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/scan")
    public ResponseEntity<AttendanceScanResponse> scanQRCode(@RequestBody Map<String, String> request) {
        String qrData = request.get("qrData");
        Attendance attendance = attendanceService.scanQRCode(qrData);

        return ResponseEntity.ok(new AttendanceScanResponse(
                attendance.getAttendanceId(),
                attendance.getScannedAt(),
                attendance.getStatus().name(),
                attendance.getRegistration().getRegId(),
                attendance.getRegistration().getUser().getFullName(),
                attendance.getRegistration().getUser().getEmail(),
                attendance.getEvent().getEventId(),
                attendance.getEvent().getTitle()
        ));
    }

    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<Long> getAttendanceCount(@PathVariable Long eventId) {
        return ResponseEntity.ok(attendanceService.getEventAttendanceCount(eventId));
    }
}
