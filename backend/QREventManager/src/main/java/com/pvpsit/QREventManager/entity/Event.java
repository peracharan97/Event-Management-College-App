package com.pvpsit.QREventManager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "event_sub_events", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "sub_event")
    private List<String> subEvents = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "created_by")
    private User createdBy;

    @JsonIgnore
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Registration> registrations;
}
