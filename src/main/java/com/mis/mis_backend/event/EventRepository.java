package com.mis.mis_backend.event;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByEventDateBetweenOrderByEventDateAsc(LocalDate start, LocalDate end);

    List<Event> findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate fromDate);
}
