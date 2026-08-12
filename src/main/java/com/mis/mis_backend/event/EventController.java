package com.mis.mis_backend.event;

import com.mis.mis_backend.event.dto.EventRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Event> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(eventService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<Event>> getForMonth(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(eventService.getForMonth(year, month));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcoming() {
        return ResponseEntity.ok(eventService.getUpcoming());
    }
}
