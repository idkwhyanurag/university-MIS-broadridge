package com.mis.mis_backend.event;

import com.mis.mis_backend.announcement.TargetRole;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_audience", nullable = false, length = 20)
    private TargetRole targetAudience;

    public Event() {
    }

    public Event(String title, String description, LocalDate eventDate, Long createdBy, TargetRole targetAudience) {
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.createdBy = createdBy;
        this.targetAudience = targetAudience;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public TargetRole getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(TargetRole targetAudience) {
        this.targetAudience = targetAudience;
    }
}
