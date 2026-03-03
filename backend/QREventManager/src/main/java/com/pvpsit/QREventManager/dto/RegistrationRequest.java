package com.pvpsit.QREventManager.dto;

import lombok.Data;

import java.util.List;

@Data
public class RegistrationRequest {
    private Long eventId;
    private List<String> selectedSubEvents;
}
