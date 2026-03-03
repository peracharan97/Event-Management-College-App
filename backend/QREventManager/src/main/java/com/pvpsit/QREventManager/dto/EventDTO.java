package com.pvpsit.QREventManager.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class EventDTO {
    private Long eventId;
    private String title;
    private String description;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venue;
    private Double price;
    private Integer maxSeats;
    private Integer availableSeats;
    private Long totalRegistrations;
    private List<String> subEvents;
}
