package com.mis.mis_backend.notification;

import com.mis.mis_backend.notification.dto.NotificationRequest;
import com.mis.mis_backend.notification.dto.NotificationResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void sendNotification_savesAppNotification_withoutEmailing() {
        NotificationRequest request = new NotificationRequest();
        request.setRecipientId(1L);
        request.setType(NotificationType.APP);
        request.setMessage("Your fee payment is due.");

        Notification saved = new Notification(1L, NotificationType.APP, "Your fee payment is due.");
        when(notificationRepository.save(any(Notification.class))).thenReturn(saved);

        NotificationResponse response = notificationService.sendNotification(request);

        assertEquals(1L, response.getRecipientId());
        assertFalse(response.isRead());
    }
}
