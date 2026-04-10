package com.pvpsit.QREventManager.repository;

import com.pvpsit.QREventManager.entity.SubEventQrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubEventQrCodeRepository extends JpaRepository<SubEventQrCode, Long> {
    Optional<SubEventQrCode> findByQrData(String qrData);
    Optional<SubEventQrCode> findByRegistration_RegIdAndSubEvent(Long regId, String subEvent);
    List<SubEventQrCode> findAllByRegistration_RegIdOrderBySubEventAsc(Long regId);
}

