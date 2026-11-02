package com.apiatlas.notification.repository;

import com.apiatlas.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    long countByIsReadFalse();
}