package com.apiatlas.notification.service;

import com.apiatlas.notification.entity.Notification;
import com.apiatlas.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public void createEndpointNotification(
            Long endpointId,
            String endpointName,
            String previousStatus,
            String newStatus) {

        if (previousStatus.equalsIgnoreCase(newStatus)) {
            return;
        }

        String title;
        String message;
        String type;

        if ("DOWN".equalsIgnoreCase(newStatus)) {
            title = endpointName + " is down";
            message = "Endpoint is not responding or returned an unsuccessful response.";
            type = "ENDPOINT_DOWN";

        } else if ("OPERATIONAL".equalsIgnoreCase(newStatus)
                && "DOWN".equalsIgnoreCase(previousStatus)) {
            title = endpointName + " recovered";
            message = "Endpoint is operational again.";
            type = "ENDPOINT_RECOVERED";

        } else {
            return;
        }

        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(endpointId);
        notification.setRead(false);

        repository.save(notification);
    }
}