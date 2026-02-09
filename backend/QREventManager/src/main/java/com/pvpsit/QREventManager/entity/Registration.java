package com.pvpsit.QREventManager.entity;



import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "registrations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long regId;

    // Many Registrations → One Event
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private String studentName;
    private String studentEmail;
    private String rollNo;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus regStatus;

    private LocalDateTime createdAt;

    // One Registration → One Payment
    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    private Payment payment;

    // One Registration → One QR Code
    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    private QrCode qrCode;

    // One Registration → One Attendance
    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    private Attendance attendance;
    public enum PaymentStatus {
        PENDING, PAID
    }

    public enum RegistrationStatus {
        CONFIRMED, CANCELLED
    }

    // getters and setters
}
