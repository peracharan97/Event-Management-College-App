package com.pvpsit.QREventManager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String paymentId; // Internal payment record ID

    private String orderId;
    private Double amount;
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentResult status;

    private Boolean verified;
    private LocalDateTime paidAt;

    @Column(columnDefinition = "TEXT")
    private String transactionDetails;

    // One Payment → One Registration
    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;

    public enum PaymentResult {
        SUCCESS, FAILED, PENDING
    }
}
