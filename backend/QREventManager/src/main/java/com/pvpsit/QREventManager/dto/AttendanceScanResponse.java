package com.pvpsit.QREventManager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AttendanceScanResponse {
    private Long attendanceId;
    private LocalDateTime scannedAt;
    private String status;
    private Long registrationId;
    private String studentName;
    private String studentEmail;
    private Long eventId;
    private String eventTitle;
}
