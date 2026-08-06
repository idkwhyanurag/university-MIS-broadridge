package com.mis.mis_backend.notification.dto;

import com.mis.mis_backend.notification.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class NotificationRequest {

    @NotNull(message = "recipientId is required")
    private Long recipientId;

    @NotNull(message = "type is required")
    private NotificationType type;

    @NotBlank(message = "message cannot be empty")
    private String message;

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
