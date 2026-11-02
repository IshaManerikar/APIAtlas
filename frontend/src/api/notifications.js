import api from "./api";

export const getNotifications = async () => {
    const response = await api.get("/api/notifications");
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await api.get("/api/notifications/unread-count");
    return response.data;
};

export const markNotificationAsRead = async (id) => {
    const response = await api.patch(`/api/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    await api.patch("/api/notifications/mark-all-read");
};

export const deleteNotification = async (id) => {
    await api.delete(`/api/notifications/${id}`);
};

export const clearAllNotifications = async () => {
    await api.delete("/api/notifications");
};