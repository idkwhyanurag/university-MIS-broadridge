package com.mis.mis_backend.analytics.dto;

public class AnalyticsSummaryResponse {

    private long totalNotificationsSent;
    private long totalAnnouncements;
    private long upcomingEventsCount;
    private long totalStudents;
    private long unpaidFees;
    private long totalBooks;

    public AnalyticsSummaryResponse(long totalNotificationsSent,
                                    long totalAnnouncements,
                                    long upcomingEventsCount,
                                    long totalStudents,
                                    long unpaidFees,
                                    long totalBooks) {
        this.totalNotificationsSent = totalNotificationsSent;
        this.totalAnnouncements = totalAnnouncements;
        this.upcomingEventsCount = upcomingEventsCount;
        this.totalStudents = totalStudents;
        this.unpaidFees = unpaidFees;
        this.totalBooks = totalBooks;
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

    public long getTotalStudents() {
        return totalStudents;
    }

    public long getUnpaidFees() {
        return unpaidFees;
    }

    public long getTotalBooks() {
        return totalBooks;
    }
}
