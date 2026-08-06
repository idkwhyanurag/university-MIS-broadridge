package com.mis.mis_backend.event.dto;

import com.mis.mis_backend.announcement.TargetRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class EventRequest {

    @NotBlank(message = "title cannot be empty")
    private String title;

    private String description;

    @NotNull(message = "eventDate is required")
    private LocalDate eventDate;

    @NotNull(message = "createdBy is required")
    private Long createdBy;

    @NotNull(message = "targetAudience is required")
    private TargetRole targetAudience;

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

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public TargetRole getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(TargetRole targetAudience) {
        this.targetAudience = targetAudience;
    }
}
