package com.pvpsit.QREventManager.repository;

import com.pvpsit.QREventManager.entity.Attendance;
import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByRegistration(Registration registration);
    List<Attendance> findByEvent(Event event);
    Long countByEvent(Event event);
}