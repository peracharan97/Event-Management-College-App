package com.pvpsit.QREventManager.controller;

import com.pvpsit.QREventManager.dto.AnalyticsDTO;
import com.pvpsit.QREventManager.dto.StudentStatusDTO;
import com.pvpsit.QREventManager.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<AnalyticsDTO> getEventAnalytics(@PathVariable Long eventId) {
        return ResponseEntity.ok(analyticsService.getEventAnalytics(eventId));
    }

    @GetMapping("/event/{eventId}/csv")
    public ResponseEntity<byte[]> downloadEventAnalyticsCsv(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "all") String type
    ) {
        byte[] csv = analyticsService.generateEventAnalyticsCsv(eventId, type);
        String filename = "event-" + eventId + "-analytics-" + type + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(csv);
    }

    @GetMapping("/event/{eventId}/students")
    public ResponseEntity<List<StudentStatusDTO>> getEventStudents(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "ALL") String department,
            @RequestParam(required = false) Integer semester
    ) {
        return ResponseEntity.ok(analyticsService.getEventStudentsByDepartmentAndSemester(eventId, department, semester));
    }
}
