package com.pvpsit.QREventManager.entity;



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

    private LocalDateTime generatedAt;

    // One QR → One Registration
    @OneToOne
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;

    // getters and setters
}
