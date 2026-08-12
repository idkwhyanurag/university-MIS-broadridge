package com.mis.mis_backend.announcement.dto;

import com.mis.mis_backend.announcement.Announcement;
import com.mis.mis_backend.announcement.TargetRole;

import java.time.LocalDateTime;

public class AnnouncementResponse {

    private Long id;
    private Long postedBy;
    private String title;
    private String body;
    private TargetRole targetRole;
    private LocalDateTime createdAt;

    public AnnouncementResponse(Announcement a) {
        this.id = a.getId();
        this.postedBy = a.getPostedBy();
        this.title = a.getTitle();
        this.body = a.getBody();
        this.targetRole = a.getTargetRole();
        this.createdAt = a.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getPostedBy() {
        return postedBy;
    }

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }

    public TargetRole getTargetRole() {
        return targetRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
