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

    public enum EventStatus {
        ACTIVE,
        ARCHIVED,
        DELETED
    }

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus status = EventStatus.ACTIVE;

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

    @PrePersist
    public void ensureStatus() {
        if (status == null) {
            status = EventStatus.ACTIVE;
        }
    }
}
