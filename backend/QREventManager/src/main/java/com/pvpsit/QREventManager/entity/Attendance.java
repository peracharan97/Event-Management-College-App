package com.pvpsit.QREventManager.entity;



import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    private LocalDateTime scannedAt;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    // One Attendance → One Registration
    @OneToOne
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;

    // Many Attendance → One Event
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    public enum AttendanceStatus {
        PRESENT
    }

    // getters and setters
}
