package com.pvpsit.QREventManager.repository;

import com.pvpsit.QREventManager.entity.Event;
import com.pvpsit.QREventManager.entity.Event.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventDateAfter(LocalDate date);
    List<Event> findByEventDateBefore(LocalDate date);
    List<Event> findByStatus(EventStatus status);
    List<Event> findByStatusAndEventDateAfter(EventStatus status, LocalDate date);
    @Query("SELECT e FROM Event e WHERE e.status = com.pvpsit.QREventManager.entity.Event$EventStatus.ACTIVE OR e.status IS NULL")
    List<Event> findActiveEvents();
    @Query("SELECT e FROM Event e WHERE (e.status = com.pvpsit.QREventManager.entity.Event$EventStatus.ACTIVE OR e.status IS NULL) AND e.eventDate > :date")
    List<Event> findActiveEventsByEventDateAfter(@Param("date") LocalDate date);

    @Query("SELECT e FROM Event e LEFT JOIN e.registrations r GROUP BY e.eventId " +
            "HAVING COUNT(r) < e.maxSeats OR e.maxSeats IS NULL")
    List<Event> findAvailableEvents();
}
