package com.pvpsit.QREventManager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StudentStatusDTO {
    private Long regId;
    private String studentName;
    private String email;
    private String rollNo;
    private String department;
    private String semester;
    private String paymentStatus;
    private String attendanceStatus;
    private List<String> selectedSubEvents;
}
