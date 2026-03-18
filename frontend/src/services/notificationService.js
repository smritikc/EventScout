import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Get all notifications for current user
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark a single notification as read
export const markAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const response = await axios.patch(`${API_URL}/notifications/read-all`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Get unread count
export const getUnreadCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/unread/count`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Subscribe to push notifications (for PWA)
export const subscribeToPushNotifications = async (subscription) => {
  try {
    const response = await axios.post(`${API_URL}/notifications/subscribe`, subscription);
    return response.data;
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    throw error;
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings) => {
  try {
    const response = await axios.put(`${API_URL}/users/notification-settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};