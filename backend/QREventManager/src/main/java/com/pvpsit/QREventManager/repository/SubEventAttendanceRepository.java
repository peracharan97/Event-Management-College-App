package com.pvpsit.QREventManager.repository;

import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.Registration;
import com.pvpsit.QREventManager.entity.SubEventAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubEventAttendanceRepository extends JpaRepository<SubEventAttendance, Long> {
    Optional<SubEventAttendance> findByRegistrationAndSubEventIgnoreCase(Registration registration, String subEvent);
    List<SubEventAttendance> findByEvent(Event event);
    List<SubEventAttendance> findByEventAndSubEventIgnoreCase(Event event, String subEvent);
    Long countByEventAndSubEventIgnoreCase(Event event, String subEvent);
}

