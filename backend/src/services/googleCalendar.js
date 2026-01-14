const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// OAuth2 client configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Calendar API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
];

/**
 * Generate OAuth URL for user authentication
 */
const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Force consent screen to get refresh token
  });
};

/**
 * Exchange authorization code for tokens
 */
const getTokensFromCode = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens from code:', error);
    throw new Error('Failed to exchange authorization code for tokens');
  }
};

/**
 * Store user's Google Calendar tokens in Supabase
 */
const storeUserTokens = async (userId, tokens) => {
  try {
    const { data, error } = await supabase
      .from('google_tokens')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(tokens.expiry_date),
        updated_at: new Date()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error storing user tokens:', error);
    throw new Error('Failed to store Google Calendar tokens');
  }
};

/**
 * Get user's Google Calendar tokens from Supabase
 */
const getUserTokens = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('google_tokens')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No tokens found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting user tokens:', error);
    throw new Error('Failed to retrieve Google Calendar tokens');
  }
};

/**
 * Refresh access token if expired
 */
const refreshAccessToken = async (userId) => {
  try {
    const tokenData = await getUserTokens(userId);
    if (!tokenData || !tokenData.refresh_token) {
      throw new Error('No refresh token available');
    }

    oauth2Client.setCredentials({
      refresh_token: tokenData.refresh_token
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Store new tokens
    await storeUserTokens(userId, {
      access_token: credentials.access_token,
      refresh_token: tokenData.refresh_token, // Keep existing refresh token
      expiry_date: credentials.expiry_date
    });

    return credentials;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
};

/**
 * Get authenticated calendar client for user
 */
const getCalendarClient = async (userId) => {
  try {
    let tokenData = await getUserTokens(userId);
    
    if (!tokenData) {
      throw new Error('User not authenticated with Google Calendar');
    }

    // Check if token is expired
    const now = new Date();
    const expiry = new Date(tokenData.token_expiry);
    
    if (now >= expiry) {
      // Token expired, refresh it
      const newTokens = await refreshAccessToken(userId);
      oauth2Client.setCredentials(newTokens);
    } else {
      // Token still valid
      oauth2Client.setCredentials({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
      });
    }

    return google.calendar({ version: 'v3', auth: oauth2Client });
  } catch (error) {
    console.error('Error getting calendar client:', error);
    throw error;
  }
};

/**
 * Fetch calendar events for a date range
 */
const getCalendarEvents = async (userId, startDate, endDate) => {
  try {
    const calendar = await getCalendarClient(userId);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Failed to fetch Google Calendar events');
  }
};

/**
 * Create a new calendar event
 */
const createCalendarEvent = async (userId, eventData) => {
  try {
    const calendar = await getCalendarClient(userId);

    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startTime,
        timeZone: eventData.timeZone || 'UTC'
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: eventData.timeZone || 'UTC'
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create Google Calendar event');
  }
};

/**
 * Update an existing calendar event
 */
const updateCalendarEvent = async (userId, eventId, eventData) => {
  try {
    const calendar = await getCalendarClient(userId);

    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startTime,
        timeZone: eventData.timeZone || 'UTC'
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: eventData.timeZone || 'UTC'
      }
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: event
    });

    return response.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw new Error('Failed to update Google Calendar event');
  }
};

/**
 * Delete a calendar event
 */
const deleteCalendarEvent = async (userId, eventId) => {
  try {
    const calendar = await getCalendarClient(userId);

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw new Error('Failed to delete Google Calendar event');
  }
};

/**
 * Disconnect user's Google Calendar
 */
const disconnectCalendar = async (userId) => {
  try {
    const { error } = await supabase
      .from('google_tokens')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    throw new Error('Failed to disconnect Google Calendar');
  }
};

/**
 * Check if user has connected Google Calendar
 */
const isCalendarConnected = async (userId) => {
  try {
    const tokenData = await getUserTokens(userId);
    return !!tokenData;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getAuthUrl,
  getTokensFromCode,
  storeUserTokens,
  getUserTokens,
  refreshAccessToken,
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  disconnectCalendar,
  isCalendarConnected
};
