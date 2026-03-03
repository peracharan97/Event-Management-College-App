package com.pvpsit.QREventManager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AnalyticsDTO {
    private Long totalRegistrations;
    private Long paidRegistrations;
    private Long unpaidRegistrations;
    private Long totalAttendance;
    private Double attendancePercentage;
    private Double totalRevenue;
    private Double paymentSuccessRate;
    private List<BranchAnalytics> branchAnalytics;
    private List<SemesterAnalytics> semesterAnalytics;
    private List<BranchSemesterAnalytics> branchSemesterAnalytics;

    @Data
    @AllArgsConstructor
    public static class BranchAnalytics {
        private String branch;
        private Long totalRegistrations;
        private Long paidRegistrations;
        private Long attendanceCount;
        private Double attendanceRate;
        private Double totalRevenue;
        private Double paymentSuccessRate;
    }

    @Data
    @AllArgsConstructor
    public static class SemesterAnalytics {
        private String semester;
        private Long totalRegistrations;
        private Long paidRegistrations;
        private Long attendanceCount;
        private Double attendanceRate;
        private Double totalRevenue;
        private Double paymentSuccessRate;
    }

    @Data
    @AllArgsConstructor
    public static class BranchSemesterAnalytics {
        private String branch;
        private String semester;
        private Long totalRegistrations;
        private Long paidRegistrations;
        private Long attendanceCount;
        private Double attendanceRate;
        private Double totalRevenue;
        private Double paymentSuccessRate;
    }
}
