package com.pvpsit.QREventManager.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venue;
    private Double price;
    private Integer maxSeats;
    private LocalDateTime createdAt=LocalDateTime.now();

    // One Event → Many Registrations
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Registration> registrations;

    // getters and setters
}
