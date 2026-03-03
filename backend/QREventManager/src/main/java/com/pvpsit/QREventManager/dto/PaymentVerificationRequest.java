package com.pvpsit.QREventManager.dto;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private Long regId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
