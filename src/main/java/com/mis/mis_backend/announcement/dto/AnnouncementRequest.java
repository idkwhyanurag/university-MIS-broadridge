package com.mis.mis_backend.announcement.dto;

import com.mis.mis_backend.announcement.TargetRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AnnouncementRequest {

    @NotNull(message = "postedBy is required")
    private Long postedBy;

    @NotBlank(message = "title cannot be empty")
    private String title;

    @NotBlank(message = "body cannot be empty")
    private String body;

    @NotNull(message = "targetRole is required")
    private TargetRole targetRole;

    public Long getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(Long postedBy) {
        this.postedBy = postedBy;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public TargetRole getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(TargetRole targetRole) {
        this.targetRole = targetRole;
    }
}
