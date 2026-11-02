package com.apiatlas.notification.controller;

import com.apiatlas.notification.entity.Notification;
import com.apiatlas.notification.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(
                repository.findAllByOrderByCreatedAtDesc()
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(
                repository.countByIsReadFalse()
        );
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = repository.findById(id)
                .orElse(null);

        if (notification == null) {
            return ResponseEntity.notFound().build();
        }

        notification.setRead(true);
        repository.save(notification);

        return ResponseEntity.ok(notification);
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead() {
        List<Notification> notifications =
                repository.findAllByOrderByCreatedAtDesc();

        notifications.forEach(notification ->
                notification.setRead(true)
        );

        repository.saveAll(notifications);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearAllNotifications() {
        repository.deleteAll();
        return ResponseEntity.noContent().build();
    }
}