const express = require('express');
const router = express.Router();
const googleCalendarService = require('../services/googleCalendar');

/**
 * @route   GET /api/google/auth
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/auth', (req, res) => {
    try {
        // Store user ID in session or pass as state parameter
        const userId = req.query.userId;

        const authUrl = googleCalendarService.getAuthUrl();

        // In production, you'd want to store userId in session or encode it in state parameter
        // For now, we'll pass it as a query parameter
        const urlWithState = `${authUrl}&state=${userId}`;

        res.json({ authUrl: urlWithState });
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({ error: 'Failed to generate authentication URL' });
    }
});

/**
 * @route   GET /api/google/callback
 * @desc    Handle OAuth callback from Google
 * @access  Public
 */
router.get('/callback', async (req, res) => {
    try {
        const { code, state } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code not provided' });
        }

        // Get userId from state parameter
        const userId = state;

        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }

        // Exchange code for tokens
        const tokens = await googleCalendarService.getTokensFromCode(code);

        // Store tokens in database
        await googleCalendarService.storeUserTokens(userId, tokens);

        // Redirect to frontend success page
        res.redirect(`http://localhost:5173/student/calendar?auth=success`);
    } catch (error) {
        console.error('Error in OAuth callback:', error);
        res.redirect(`http://localhost:5173/student/calendar?auth=error`);
    }
});

/**
 * @route   GET /api/google/status
 * @desc    Check if user has connected Google Calendar
 * @access  Private
 */
router.get('/status', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const isConnected = await googleCalendarService.isCalendarConnected(userId);

        res.json({ connected: isConnected });
    } catch (error) {
        console.error('Error checking calendar status:', error);
        res.status(500).json({ error: 'Failed to check calendar status' });
    }
});

/**
 * @route   POST /api/google/disconnect
 * @desc    Disconnect user's Google Calendar
 * @access  Private
 */
router.post('/disconnect', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        await googleCalendarService.disconnectCalendar(userId);

        res.json({ success: true, message: 'Google Calendar disconnected successfully' });
    } catch (error) {
        console.error('Error disconnecting calendar:', error);
        res.status(500).json({ error: 'Failed to disconnect Google Calendar' });
    }
});

module.exports = router;
