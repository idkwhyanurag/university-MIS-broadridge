package com.mis.mis_backend.analytics;

import com.mis.mis_backend.analytics.dto.AnalyticsSummaryResponse;
import com.mis.mis_backend.analytics.dto.RiskCheckRequest;
import com.mis.mis_backend.announcement.AnnouncementRepository;
import com.mis.mis_backend.event.EventRepository;
import com.mis.mis_backend.fee.repository.FeeRepository;
import com.mis.mis_backend.library.repository.BookRepository;
import com.mis.mis_backend.notification.NotificationRepository;
import com.mis.mis_backend.student.StudentRepository;
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
    private final StudentRepository studentRepository;
    private final FeeRepository feeRepository;
    private final BookRepository bookRepository;
    private final RiskService riskService;

    public AnalyticsController(NotificationRepository notificationRepository,
                               AnnouncementRepository announcementRepository,
                               EventRepository eventRepository,
                               StudentRepository studentRepository,
                               FeeRepository feeRepository,
                               BookRepository bookRepository,
                               RiskService riskService) {
        this.notificationRepository = notificationRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
        this.feeRepository = feeRepository;
        this.bookRepository = bookRepository;
        this.riskService = riskService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> summary() {
        long notifications = notificationRepository.count();
        long announcements = announcementRepository.count();
        long upcomingEvents = eventRepository
                .findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now())
                .size();
        long students = studentRepository.count();
        long unpaidFees = feeRepository.findAll().stream()
                .filter(f -> f.getPaymentStatus() != null
                        && !"PAID".equalsIgnoreCase(f.getPaymentStatus()))
                .count();
        long books = bookRepository.count();
        return ResponseEntity.ok(new AnalyticsSummaryResponse(
                notifications, announcements, upcomingEvents, students, unpaidFees, books));
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
