package com.mis.mis_backend.analytics;

import com.mis.mis_backend.analytics.dto.AnalyticsSummaryResponse;
import com.mis.mis_backend.analytics.dto.RiskCheckRequest;
import com.mis.mis_backend.announcement.AnnouncementRepository;
import com.mis.mis_backend.event.EventRepository;
import com.mis.mis_backend.notification.NotificationRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final NotificationRepository notificationRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final RiskService riskService;

    public AnalyticsController(NotificationRepository notificationRepository,
                                AnnouncementRepository announcementRepository,
                                EventRepository eventRepository,
                                RiskService riskService) {
        this.notificationRepository = notificationRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.riskService = riskService;
    }

    // Covers what this module owns directly. Once Person 1/2/3 expose their own
    // REST endpoints (student counts, fee collection %, exam pass rate), call
    // those here too (via RestTemplate/WebClient) and merge into one response
    // for the frontend dashboard to consume in a single request.
    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> summary() {
        long notifications = notificationRepository.count();
        long announcements = announcementRepository.count();
        long upcomingEvents = eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now()).size();
        return ResponseEntity.ok(new AnalyticsSummaryResponse(notifications, announcements, upcomingEvents));
    }

    @PostMapping("/risk-check")
    public ResponseEntity<Map<String, Object>> riskCheck(@Valid @RequestBody RiskCheckRequest request) {
        boolean atRisk = riskService.isAtRisk(request);
        String reason = riskService.riskReason(request);
        return ResponseEntity.ok(Map.of(
                "studentId", request.getStudentId(),
                "atRisk", atRisk,
                "reason", reason
        ));
    }
}
