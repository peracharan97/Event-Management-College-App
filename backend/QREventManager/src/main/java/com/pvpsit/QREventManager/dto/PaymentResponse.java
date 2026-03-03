package com.pvpsit.QREventManager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private String orderId;
    private String keyId;
    private Integer amount;
    private String currency;
    private String receipt;
    private Long regId;
}
