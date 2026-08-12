package com.mis.mis_backend.notification;

import com.mis.mis_backend.notification.dto.NotificationRequest;
import com.mis.mis_backend.notification.dto.NotificationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@mis.local}")
    private String fromAddress;

    // TODO(team): once Person 1's User module exists, replace this with a real
    // lookup of the recipient's email address by userId. For now this is a stub
    // so the notification feature works end-to-end without a hard dependency.
    private String resolveEmailForUser(Long userId) {
        return "user" + userId + "@example.com";
    }

    public NotificationService(NotificationRepository notificationRepository, JavaMailSender mailSender) {
        this.notificationRepository = notificationRepository;
        this.mailSender = mailSender;
    }

    public NotificationResponse sendNotification(NotificationRequest request) {
        Notification notification = new Notification(
                request.getRecipientId(),
                request.getType(),
                request.getMessage()
        );
        Notification saved = notificationRepository.save(notification);

        if (request.getType() == NotificationType.EMAIL) {
            sendEmail(request.getRecipientId(), request.getMessage());
        }

        return new NotificationResponse(saved);
    }

    // Call this directly from other modules (e.g. Person 1 or Person 2's services)
    // when something happens that a user needs to be told about.
    public NotificationResponse sendNotification(Long recipientId, String message, NotificationType type) {
        NotificationRequest req = new NotificationRequest();
        req.setRecipientId(recipientId);
        req.setMessage(message);
        req.setType(type);
        return sendNotification(req);
    }

    private void sendEmail(Long recipientId, String message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromAddress);
            mail.setTo(resolveEmailForUser(recipientId));
            mail.setSubject("University MIS Notification");
            mail.setText(message);
            mailSender.send(mail);
        } catch (Exception e) {
            // Don't let a failed email break the request - the in-app notification
            // is already saved. Log and move on.
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    public List<NotificationResponse> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::new)
                .toList();
    }

    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + id));
        notification.setRead(true);
        return new NotificationResponse(notificationRepository.save(notification));
    }
}
