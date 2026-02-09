package com.pvpsit.QREventManager.entity;



import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
@Table(name = "email_logs")
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long emailId;

    private String email;
    private String subject;
    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    private EmailStatus status;

    // Many Email Logs → One Registration
    @ManyToOne
    @JoinColumn(name = "reg_id", nullable = false)
    private Registration registration;

    public enum EmailStatus {
        SENT, FAILED
    }

    // getters and setters
}
