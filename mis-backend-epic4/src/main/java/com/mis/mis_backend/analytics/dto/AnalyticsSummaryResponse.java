package com.mis.mis_backend.analytics.dto;

public class AnalyticsSummaryResponse {

    private long totalNotificationsSent;
    private long totalAnnouncements;
    private long upcomingEventsCount;

    public AnalyticsSummaryResponse(long totalNotificationsSent, long totalAnnouncements, long upcomingEventsCount) {
        this.totalNotificationsSent = totalNotificationsSent;
        this.totalAnnouncements = totalAnnouncements;
        this.upcomingEventsCount = upcomingEventsCount;
    }

    public long getTotalNotificationsSent() {
        return totalNotificationsSent;
    }

    public long getTotalAnnouncements() {
        return totalAnnouncements;
    }

    public long getUpcomingEventsCount() {
        return upcomingEventsCount;
    }
}
