package com.mis.mis_backend.analytics;

import com.mis.mis_backend.analytics.dto.RiskCheckRequest;
import org.springframework.stereotype.Service;

/**
 * Baseline (non-ML) at-risk-student detection: a straightforward rule.
 * This is the honest, defensible version — flag a student if attendance
 * drops below 75% AND they have 2+ failed exams.
 *
 * Stretch goal once this works: replace/augment with a call to an LLM that
 * takes the same inputs and returns a short natural-language risk summary
 * instead of just a boolean. Keep this rule-based version as the fallback.
 */
@Service
public class RiskService {

    private static final double ATTENDANCE_THRESHOLD = 75.0;
    private static final int FAILED_EXAM_THRESHOLD = 2;

    public boolean isAtRisk(RiskCheckRequest request) {
        boolean lowAttendance = request.getAttendancePercentage() < ATTENDANCE_THRESHOLD;
        boolean tooManyFailures = request.getFailedExamCount() >= FAILED_EXAM_THRESHOLD;
        return lowAttendance && tooManyFailures;
    }

    public String riskReason(RiskCheckRequest request) {
        if (!isAtRisk(request)) {
            return "Not flagged.";
        }
        return String.format(
                "Attendance %.1f%% (below %.0f%% threshold) with %d failed exam(s) (threshold: %d).",
                request.getAttendancePercentage(), ATTENDANCE_THRESHOLD,
                request.getFailedExamCount(), FAILED_EXAM_THRESHOLD
        );
    }
}
