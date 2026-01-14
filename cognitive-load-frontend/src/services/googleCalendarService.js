import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

/**
 * Check if user has connected Google Calendar
 */
export const checkConnectionStatus = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/api/google/status`, {
            params: { userId }
        });
        return response.data.connected;
    } catch (error) {
        console.error('Error checking Google Calendar connection:', error);
        return false;
    }
};

/**
 * Initiate Google OAuth flow
 */
export const connectGoogleCalendar = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/api/google/auth`, {
            params: { userId }
        });

        if (response.data.authUrl) {
            // Open OAuth URL in popup window
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            const popup = window.open(
                response.data.authUrl,
                'Google Calendar Authorization',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            return new Promise((resolve, reject) => {
                // Check if popup was closed
                const checkPopup = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkPopup);
                        // Check connection status after popup closes
                        checkConnectionStatus(userId).then(resolve).catch(reject);
                    }
                }, 500);

                // Timeout after 5 minutes
                setTimeout(() => {
                    clearInterval(checkPopup);
                    if (!popup.closed) {
                        popup.close();
                    }
                    reject(new Error('Authentication timeout'));
                }, 300000);
            });
        }
    } catch (error) {
        console.error('Error connecting Google Calendar:', error);
        throw error;
    }
};

/**
 * Disconnect Google Calendar
 */
export const disconnectGoogleCalendar = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/api/google/disconnect`, {
            userId
        });
        return response.data.success;
    } catch (error) {
        console.error('Error disconnecting Google Calendar:', error);
        throw error;
    }
};

/**
 * Fetch Google Calendar events for a date range
 */
export const getCalendarEvents = async (userId, startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/api/calendar/events`, {
            params: {
                userId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });
        return response.data.events || [];
    } catch (error) {
        if (error.response?.status === 401) {
            // Not authenticated
            return [];
        }
        console.error('Error fetching Google Calendar events:', error);
        throw error;
    }
};

/**
 * Create a new Google Calendar event
 */
export const createCalendarEvent = async (userId, eventData) => {
    try {
        const response = await axios.post(`${API_URL}/api/calendar/events`, {
            userId,
            ...eventData
        });
        return response.data.event;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
};

/**
 * Update a Google Calendar event
 */
export const updateCalendarEvent = async (userId, eventId, eventData) => {
    try {
        const response = await axios.put(`${API_URL}/api/calendar/events/${eventId}`, {
            userId,
            ...eventData
        });
        return response.data.event;
    } catch (error) {
        console.error('Error updating calendar event:', error);
        throw error;
    }
};

/**
 * Delete a Google Calendar event
 */
export const deleteCalendarEvent = async (userId, eventId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/calendar/events/${eventId}`, {
            params: { userId }
        });
        return response.data.success;
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        throw error;
    }
};

export const googleCalendarService = {
    checkConnectionStatus,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
};
