package com.pvpsit.QREventManager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "registration_sub_events", joinColumns = @JoinColumn(name = "reg_id"))
    @Column(name = "sub_event")
    private List<String> selectedSubEvents = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus regStatus;

    private Double registrationFee;

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
