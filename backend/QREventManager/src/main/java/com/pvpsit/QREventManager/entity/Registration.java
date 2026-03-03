package com.pvpsit.QREventManager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus regStatus;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    @JsonIgnore
    private Payment payment;

    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    @JsonIgnore
    private QrCode qrCode;

    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL)
    @JsonIgnore
    private Attendance attendance;

    public enum PaymentStatus {
        PENDING, PAID
    }

    public enum RegistrationStatus {
        CONFIRMED, CANCELLED
    }
}
