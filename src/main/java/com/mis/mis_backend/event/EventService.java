package com.mis.mis_backend.event;

import com.mis.mis_backend.event.dto.EventRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event create(EventRequest request) {
        Event event = new Event(
                request.getTitle(),
                request.getDescription(),
                request.getEventDate(),
                request.getCreatedBy(),
                request.getTargetAudience()
        );
        return eventRepository.save(event);
    }

    public List<Event> getForMonth(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return eventRepository.findByEventDateBetweenOrderByEventDateAsc(
                yearMonth.atDay(1),
                yearMonth.atEndOfMonth()
        );
    }

    public List<Event> getUpcoming() {
        return eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now());
    }
}
