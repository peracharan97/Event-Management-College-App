package com.pvpsit.QREventManager.service;

import com.pvpsit.QREventManager.dto.PaymentRequest;
import com.pvpsit.QREventManager.dto.PaymentResponse;
import com.pvpsit.QREventManager.dto.PaymentVerificationRequest;
import com.pvpsit.QREventManager.entity.Payment;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RegistrationService registrationService;
    private final QRCodeService qrCodeService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.currency:INR}")
    private String razorpayCurrency;

    @Transactional
    public PaymentResponse initiatePayment(PaymentRequest request) {
        if (request == null || request.getRegId() == null) {
            throw new RuntimeException("Registration id is required for payment initiation");
        }

        validateRazorpayConfig();

        Registration registration = registrationService.getRegistrationById(request.getRegId());

        if (Registration.PaymentStatus.PAID.equals(registration.getPaymentStatus())) {
            throw new RuntimeException("Payment already completed for this registration");
        }

        if (registration.getEvent() == null || registration.getEvent().getPrice() == null) {
            throw new RuntimeException("Event price is not configured");
        }

        Integer amountInPaise = BigDecimal.valueOf(registration.getEvent().getPrice())
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .intValueExact();

        String receipt = "reg_" + registration.getRegId() + "_" + System.currentTimeMillis();

        String razorpayOrderId;
        JSONObject order;
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", razorpayCurrency);
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", 1);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            razorpayOrderId = razorpayOrder.get("id").toString();
            order = razorpayOrder.toJson();
        } catch (RazorpayException ex) {
            throw new RuntimeException(
                    "Razorpay authentication failed. Set valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET",
                    ex
            );
        } catch (Exception ex) {
            throw new RuntimeException("Unable to initiate payment with Razorpay", ex);
        }

        Optional<Payment> existingPayment = paymentRepository.findByRegistration(registration);
        Payment payment = existingPayment.orElseGet(() -> {
            Payment newPayment = new Payment();
            newPayment.setPaymentId(UUID.randomUUID().toString());
            newPayment.setRegistration(registration);
            return newPayment;
        });

        payment.setOrderId(razorpayOrderId);
        payment.setAmount(registration.getEvent().getPrice());
        payment.setPaymentMethod("RAZORPAY");
        payment.setStatus(Payment.PaymentResult.PENDING);
        payment.setVerified(false);
        payment.setTransactionDetails(order.toString());
        payment.setPaidAt(null);
        paymentRepository.save(payment);

        return new PaymentResponse(
                razorpayOrderId,
                razorpayKeyId,
                amountInPaise,
                razorpayCurrency,
                receipt,
                registration.getRegId()
        );
    }

    private void validateRazorpayConfig() {
        if (!StringUtils.hasText(razorpayKeyId) || !StringUtils.hasText(razorpayKeySecret)) {
            throw new RuntimeException("Razorpay keys are missing in server configuration");
        }
        if ("rzp_test_change_me".equals(razorpayKeyId) || "change_me".equals(razorpayKeySecret)) {
            throw new RuntimeException("Razorpay keys are placeholders. Configure real keys in environment variables");
        }
    }

    @Transactional
    public void verifyPayment(PaymentVerificationRequest request) {
        if (request.getRegId() == null
                || request.getRazorpayOrderId() == null
                || request.getRazorpayPaymentId() == null
                || request.getRazorpaySignature() == null) {
            throw new RuntimeException("Invalid payment verification payload");
        }

        Registration registration = registrationService.getRegistrationById(request.getRegId());
        Payment payment = paymentRepository.findByRegistration(registration)
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        if (!request.getRazorpayOrderId().equals(payment.getOrderId())) {
            payment.setStatus(Payment.PaymentResult.FAILED);
            payment.setVerified(false);
            paymentRepository.save(payment);
            throw new RuntimeException("Payment order mismatch");
        }

        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        String expectedSignature = hmacSha256(payload, razorpayKeySecret);

        if (!expectedSignature.equals(request.getRazorpaySignature())) {
            payment.setStatus(Payment.PaymentResult.FAILED);
            payment.setVerified(false);
            paymentRepository.save(payment);
            throw new RuntimeException("Invalid payment signature");
        }

        payment.setStatus(Payment.PaymentResult.SUCCESS);
        payment.setVerified(true);
        payment.setPaidAt(LocalDateTime.now());
        payment.setTransactionDetails(request.getRazorpayPaymentId());
        paymentRepository.save(payment);

        registrationService.updatePaymentStatus(registration.getRegId(), Registration.PaymentStatus.PAID);
        qrCodeService.generateQRCode(registration);
    }

    private String hmacSha256(String data, String secret) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKeySpec);
            byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate payment signature", e);
        }
    }
}
