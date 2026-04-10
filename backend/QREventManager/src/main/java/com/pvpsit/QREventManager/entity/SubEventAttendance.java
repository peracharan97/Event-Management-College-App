package com.pvpsit.QREventManager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(
        name = "sub_event_attendance",
        uniqueConstraints = @UniqueConstraint(name = "uk_sub_event_att_reg_sub", columnNames = {"reg_id", "sub_event"})
)
public class SubEventAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    @Column(name = "sub_event", nullable = false)
    private String subEvent;

    private LocalDateTime scannedAt;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    public enum AttendanceStatus {
        PRESENT
    }
}

