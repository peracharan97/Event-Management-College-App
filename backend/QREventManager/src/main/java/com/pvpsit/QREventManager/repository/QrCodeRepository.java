package com.pvpsit.QREventManager.repository;

import com.pvpsit.QREventManager.entity.QrCode;
import com.pvpsit.QREventManager.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, Long> {
    Optional<QrCode> findByRegistration(Registration registration);
    Optional<QrCode> findByQrData(String qrData);
    Optional<QrCode> findByRegistration_RegId(Long regId);

}