package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.dto.AnalyticsDTO;
import com.pvpsit.QREventManager.dto.StudentStatusDTO;
import com.pvpsit.QREventManager.entity.Attendance;
import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.repository.AttendanceRepository;
import com.pvpsit.QREventManager.repository.EventRepository;
import com.pvpsit.QREventManager.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RegistrationRepository registrationRepository;
    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;

    public AnalyticsDTO getEventAnalytics(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Registration> registrations = registrationRepository.findByEvent(event);
        Set<Long> attendedRegistrationIds = extractAttendedRegistrationIds(event);

        long totalRegistrations = registrations.size();
        long paidRegistrations = registrations.stream()
                .filter(registration -> Registration.PaymentStatus.PAID.equals(registration.getPaymentStatus()))
                .count();
        Long unpaidRegistrations = totalRegistrations - paidRegistrations;
        long totalAttendance = attendedRegistrationIds.size();

        double attendancePercentage = totalRegistrations > 0
                ? (totalAttendance * 100.0) / totalRegistrations
                : 0.0;

        double totalRevenue = paidRegistrations * safeAmount(event.getPrice());

        double paymentSuccessRate = totalRegistrations > 0
                ? (paidRegistrations * 100.0) / totalRegistrations
                : 0.0;

        Map<String, GroupAccumulator> byBranch = new HashMap<>();
        Map<String, GroupAccumulator> bySemester = new HashMap<>();
        Map<BranchSemesterKey, GroupAccumulator> byBranchSemester = new HashMap<>();

        for (Registration registration : registrations) {
            String branch = normalizeBranch(registration);
            String semester = normalizeSemester(registration);
            boolean paid = Registration.PaymentStatus.PAID.equals(registration.getPaymentStatus());
            boolean present = attendedRegistrationIds.contains(registration.getRegId());
            double amount = paid ? safeAmount(event.getPrice()) : 0.0;

            byBranch.computeIfAbsent(branch, key -> new GroupAccumulator())
                    .accumulate(paid, present, amount);
            bySemester.computeIfAbsent(semester, key -> new GroupAccumulator())
                    .accumulate(paid, present, amount);
            byBranchSemester.computeIfAbsent(new BranchSemesterKey(branch, semester), key -> new GroupAccumulator())
                    .accumulate(paid, present, amount);
        }

        return new AnalyticsDTO(
                totalRegistrations,
                paidRegistrations,
                unpaidRegistrations,
                totalAttendance,
                attendancePercentage,
                totalRevenue,
                paymentSuccessRate,
                buildBranchAnalytics(byBranch),
                buildSemesterAnalytics(bySemester),
                buildBranchSemesterAnalytics(byBranchSemester)
        );
    }

    public byte[] generateEventAnalyticsCsv(Long eventId, String type) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        AnalyticsDTO analytics = getEventAnalytics(eventId);

        String normalizedType = type == null ? "all" : type.toLowerCase(Locale.ROOT);
        StringBuilder csv = new StringBuilder();

        csv.append("Event ID,").append(event.getEventId()).append("\n");
        csv.append("Event Title,").append(escapeCsv(event.getTitle())).append("\n");
        csv.append("Total Registrations,").append(analytics.getTotalRegistrations()).append("\n");
        csv.append("Paid Registrations,").append(analytics.getPaidRegistrations()).append("\n");
        csv.append("Unpaid Registrations,").append(analytics.getUnpaidRegistrations()).append("\n");
        csv.append("Attendance Count,").append(analytics.getTotalAttendance()).append("\n");
        csv.append("Attendance Rate (%),").append(formatDecimal(analytics.getAttendancePercentage())).append("\n");
        csv.append("Total Revenue,").append(formatDecimal(analytics.getTotalRevenue())).append("\n");
        csv.append("Payment Success Rate (%),").append(formatDecimal(analytics.getPaymentSuccessRate())).append("\n\n");

        if ("branch".equals(normalizedType) || "all".equals(normalizedType)) {
            appendBranchSection(csv, analytics.getBranchAnalytics());
        }

        if ("semester".equals(normalizedType) || "all".equals(normalizedType)) {
            appendSemesterSection(csv, analytics.getSemesterAnalytics());
        }

        if ("branch-semester".equals(normalizedType) || "all".equals(normalizedType)) {
            appendBranchSemesterSection(csv, analytics.getBranchSemesterAnalytics());
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    public List<StudentStatusDTO> getEventStudentsByDepartmentAndSemester(
            Long eventId,
            String department,
            Integer semester
    ) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String normalizedDepartment = department == null ? "ALL" : department.trim().toUpperCase(Locale.ROOT);

        return registrationRepository.findByEvent(event).stream()
                .filter(registration -> matchesDepartment(registration, normalizedDepartment))
                .filter(registration -> matchesSemester(registration, semester))
                .map(registration -> new StudentStatusDTO(
                        registration.getRegId(),
                        registration.getUser() != null ? registration.getUser().getFullName() : null,
                        registration.getUser() != null ? registration.getUser().getEmail() : null,
                        registration.getUser() != null ? registration.getUser().getRollNo() : null,
                        normalizeBranch(registration),
                        normalizeSemester(registration),
                        registration.getPaymentStatus() != null ? registration.getPaymentStatus().name() : "PENDING",
                        getAttendanceStatus(registration)
                ))
                .sorted(Comparator.comparing(StudentStatusDTO::getStudentName, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
                .toList();
    }

    private Set<Long> extractAttendedRegistrationIds(Event event) {
        Set<Long> attendedRegistrationIds = new HashSet<>();
        attendanceRepository.findByEvent(event).forEach(attendance -> {
            if (attendance.getRegistration() != null && attendance.getRegistration().getRegId() != null) {
                attendedRegistrationIds.add(attendance.getRegistration().getRegId());
            }
        });
        return attendedRegistrationIds;
    }

    private boolean matchesDepartment(Registration registration, String department) {
        if ("ALL".equals(department)) {
            return true;
        }
        return normalizeBranch(registration).equalsIgnoreCase(department);
    }

    private boolean matchesSemester(Registration registration, Integer semester) {
        if (semester == null) {
            return true;
        }
        if (registration.getUser() == null || registration.getUser().getSemester() == null) {
            return false;
        }
        return semester.equals(registration.getUser().getSemester());
    }

    private String getAttendanceStatus(Registration registration) {
        return attendanceRepository.findByRegistration(registration)
                .map(Attendance::getStatus)
                .map(Enum::name)
                .orElse("ABSENT");
    }

    private List<AnalyticsDTO.BranchAnalytics> buildBranchAnalytics(Map<String, GroupAccumulator> byBranch) {
        List<AnalyticsDTO.BranchAnalytics> data = new ArrayList<>();
        byBranch.entrySet().stream()
                .sorted(Map.Entry.comparingByKey(String.CASE_INSENSITIVE_ORDER))
                .forEach(entry -> data.add(new AnalyticsDTO.BranchAnalytics(
                        entry.getKey(),
                        entry.getValue().totalRegistrations,
                        entry.getValue().paidRegistrations,
                        entry.getValue().attendanceCount,
                        percent(entry.getValue().attendanceCount, entry.getValue().totalRegistrations),
                        entry.getValue().totalRevenue,
                        percent(entry.getValue().paidRegistrations, entry.getValue().totalRegistrations)
                )));
        return data;
    }

    private List<AnalyticsDTO.SemesterAnalytics> buildSemesterAnalytics(Map<String, GroupAccumulator> bySemester) {
        List<AnalyticsDTO.SemesterAnalytics> data = new ArrayList<>();
        bySemester.entrySet().stream()
                .sorted(Map.Entry.comparingByKey(String.CASE_INSENSITIVE_ORDER))
                .forEach(entry -> data.add(new AnalyticsDTO.SemesterAnalytics(
                        entry.getKey(),
                        entry.getValue().totalRegistrations,
                        entry.getValue().paidRegistrations,
                        entry.getValue().attendanceCount,
                        percent(entry.getValue().attendanceCount, entry.getValue().totalRegistrations),
                        entry.getValue().totalRevenue,
                        percent(entry.getValue().paidRegistrations, entry.getValue().totalRegistrations)
                )));
        return data;
    }

    private List<AnalyticsDTO.BranchSemesterAnalytics> buildBranchSemesterAnalytics(
            Map<BranchSemesterKey, GroupAccumulator> byBranchSemester
    ) {
        List<AnalyticsDTO.BranchSemesterAnalytics> data = new ArrayList<>();
        byBranchSemester.entrySet().stream()
                .sorted(Comparator
                        .comparing((Map.Entry<BranchSemesterKey, GroupAccumulator> e) -> e.getKey().branch(),
                                String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(e -> e.getKey().semester(), String.CASE_INSENSITIVE_ORDER))
                .forEach(entry -> data.add(new AnalyticsDTO.BranchSemesterAnalytics(
                        entry.getKey().branch(),
                        entry.getKey().semester(),
                        entry.getValue().totalRegistrations,
                        entry.getValue().paidRegistrations,
                        entry.getValue().attendanceCount,
                        percent(entry.getValue().attendanceCount, entry.getValue().totalRegistrations),
                        entry.getValue().totalRevenue,
                        percent(entry.getValue().paidRegistrations, entry.getValue().totalRegistrations)
                )));
        return data;
    }

    private void appendBranchSection(StringBuilder csv, List<AnalyticsDTO.BranchAnalytics> branchAnalytics) {
        csv.append("Branch-wise Analytics\n");
        csv.append("Branch,Registrations,Paid,Attendance,Attendance Rate (%),Revenue,Payment Success Rate (%)\n");
        for (AnalyticsDTO.BranchAnalytics row : branchAnalytics) {
            csv.append(escapeCsv(row.getBranch())).append(",")
                    .append(row.getTotalRegistrations()).append(",")
                    .append(row.getPaidRegistrations()).append(",")
                    .append(row.getAttendanceCount()).append(",")
                    .append(formatDecimal(row.getAttendanceRate())).append(",")
                    .append(formatDecimal(row.getTotalRevenue())).append(",")
                    .append(formatDecimal(row.getPaymentSuccessRate())).append("\n");
        }
        csv.append("\n");
    }

    private void appendSemesterSection(StringBuilder csv, List<AnalyticsDTO.SemesterAnalytics> semesterAnalytics) {
        csv.append("Semester-wise Analytics\n");
        csv.append("Semester,Registrations,Paid,Attendance,Attendance Rate (%),Revenue,Payment Success Rate (%)\n");
        for (AnalyticsDTO.SemesterAnalytics row : semesterAnalytics) {
            csv.append(escapeCsv(row.getSemester())).append(",")
                    .append(row.getTotalRegistrations()).append(",")
                    .append(row.getPaidRegistrations()).append(",")
                    .append(row.getAttendanceCount()).append(",")
                    .append(formatDecimal(row.getAttendanceRate())).append(",")
                    .append(formatDecimal(row.getTotalRevenue())).append(",")
                    .append(formatDecimal(row.getPaymentSuccessRate())).append("\n");
        }
        csv.append("\n");
    }

    private void appendBranchSemesterSection(
            StringBuilder csv,
            List<AnalyticsDTO.BranchSemesterAnalytics> branchSemesterAnalytics
    ) {
        csv.append("Branch+Semester Analytics\n");
        csv.append("Branch,Semester,Registrations,Paid,Attendance,Attendance Rate (%),Revenue,Payment Success Rate (%)\n");
        for (AnalyticsDTO.BranchSemesterAnalytics row : branchSemesterAnalytics) {
            csv.append(escapeCsv(row.getBranch())).append(",")
                    .append(escapeCsv(row.getSemester())).append(",")
                    .append(row.getTotalRegistrations()).append(",")
                    .append(row.getPaidRegistrations()).append(",")
                    .append(row.getAttendanceCount()).append(",")
                    .append(formatDecimal(row.getAttendanceRate())).append(",")
                    .append(formatDecimal(row.getTotalRevenue())).append(",")
                    .append(formatDecimal(row.getPaymentSuccessRate())).append("\n");
        }
        csv.append("\n");
    }

    private String normalizeBranch(Registration registration) {
        if (registration.getUser() == null || registration.getUser().getDepartment() == null) {
            return "Unknown";
        }
        String branch = registration.getUser().getDepartment().trim();
        return branch.isEmpty() ? "Unknown" : branch.toUpperCase(Locale.ROOT);
    }

    private String normalizeSemester(Registration registration) {
        if (registration.getUser() == null || registration.getUser().getSemester() == null) {
            return "Unknown";
        }
        Integer semester = registration.getUser().getSemester();
        return semester <= 0 ? "Unknown" : "Sem " + semester;
    }

    private double safeAmount(Double amount) {
        return amount == null ? 0.0 : amount;
    }

    private double percent(long numerator, long denominator) {
        if (denominator <= 0) {
            return 0.0;
        }
        return (numerator * 100.0) / denominator;
    }

    private String formatDecimal(Double value) {
        return String.format(Locale.ROOT, "%.2f", value == null ? 0.0 : value);
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\"") || escaped.contains("\n")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }

    private static class GroupAccumulator {
        private long totalRegistrations;
        private long paidRegistrations;
        private long attendanceCount;
        private double totalRevenue;

        void accumulate(boolean paid, boolean present, double amount) {
            totalRegistrations++;
            if (paid) {
                paidRegistrations++;
                totalRevenue += amount;
            }
            if (present) {
                attendanceCount++;
            }
        }
    }

    private record BranchSemesterKey(String branch, String semester) {
    }
}
