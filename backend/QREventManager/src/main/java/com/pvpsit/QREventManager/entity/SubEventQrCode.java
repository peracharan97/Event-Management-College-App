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
        name = "sub_event_qr_codes",
        uniqueConstraints = @UniqueConstraint(name = "uk_sub_event_qr_reg_sub", columnNames = {"reg_id", "sub_event"})
)
public class SubEventQrCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qrId;

    @Column(name = "sub_event", nullable = false)
    private String subEvent;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String qrData;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String qrImageBase64;

    private LocalDateTime generatedAt;

    private Boolean used = false;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;
}

