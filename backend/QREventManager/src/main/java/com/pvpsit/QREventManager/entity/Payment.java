package com.pvpsit.QREventManager.entity;



import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    private String paymentId; // Gateway payment ID

    private String orderId;
    private Double amount;
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentResult status;

    private Boolean verified;
    private LocalDateTime paidAt;

    // One Payment → One Registration
    @OneToOne
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;
    public enum PaymentResult {
        SUCCESS, FAILED
    }

    // getters and setters
}
