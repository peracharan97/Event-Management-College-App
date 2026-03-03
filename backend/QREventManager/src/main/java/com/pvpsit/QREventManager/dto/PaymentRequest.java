package com.pvpsit.QREventManager.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long regId;
    private Double amount;
}