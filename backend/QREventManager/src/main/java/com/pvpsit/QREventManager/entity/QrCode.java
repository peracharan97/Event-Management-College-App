package com.pvpsit.QREventManager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "qr_codes")
public class QrCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qrId;

    @Column(columnDefinition = "TEXT")
    private String qrData;

    @Column(columnDefinition = "LONGTEXT")
    private String qrImageBase64;

    private LocalDateTime generatedAt;
    private Boolean used = false;

    // One QR → One Registration
    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;
}