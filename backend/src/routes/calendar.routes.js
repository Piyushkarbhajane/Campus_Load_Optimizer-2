const express = require('express');
const router = express.Router();
const googleCalendarService = require('../services/googleCalendar');

/**
 * @route   GET /api/calendar/events
 * @desc    Fetch Google Calendar events for a date range
 * @access  Private
 */
router.get('/events', async (req, res) => {
    try {
        const { userId, startDate, endDate } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const events = await googleCalendarService.getCalendarEvents(userId, start, end);

        res.json({ events });
    } catch (error) {
        console.error('Error fetching calendar events:', error);

        if (error.message.includes('not authenticated')) {
            return res.status(401).json({ error: 'Google Calendar not connected' });
        }

        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
});

/**
 * @route   POST /api/calendar/events
 * @desc    Create a new Google Calendar event
 * @access  Private
 */
router.post('/events', async (req, res) => {
    try {
        const { userId, title, description, startTime, endTime, timeZone } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        if (!title || !startTime || !endTime) {
            return res.status(400).json({ error: 'Title, start time, and end time required' });
        }

        const eventData = {
            title,
            description,
            startTime,
            endTime,
            timeZone: timeZone || 'UTC'
        };

        const event = await googleCalendarService.createCalendarEvent(userId, eventData);

        res.json({ success: true, event });
    } catch (error) {
        console.error('Error creating calendar event:', error);
        res.status(500).json({ error: 'Failed to create calendar event' });
    }
});

/**
 * @route   PUT /api/calendar/events/:eventId
 * @desc    Update a Google Calendar event
 * @access  Private
 */
router.put('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId, title, description, startTime, endTime, timeZone } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        if (!title || !startTime || !endTime) {
            return res.status(400).json({ error: 'Title, start time, and end time required' });
        }

        const eventData = {
            title,
            description,
            startTime,
            endTime,
            timeZone: timeZone || 'UTC'
        };

        const event = await googleCalendarService.updateCalendarEvent(userId, eventId, eventData);

        res.json({ success: true, event });
    } catch (error) {
        console.error('Error updating calendar event:', error);
        res.status(500).json({ error: 'Failed to update calendar event' });
    }
});

/**
 * @route   DELETE /api/calendar/events/:eventId
 * @desc    Delete a Google Calendar event
 * @access  Private
 */
router.delete('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        await googleCalendarService.deleteCalendarEvent(userId, eventId);

        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        res.status(500).json({ error: 'Failed to delete calendar event' });
    }
});

module.exports = router;
