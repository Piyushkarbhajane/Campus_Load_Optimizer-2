const googleCalendarService = require('./googleCalendar');
const Course = require('../models/course');

/**
 * Sync a deadline to Google Calendar for all enrolled students
 * @param {Object} deadline - The deadline object with course_id, title, deadline_date, type
 */
const syncDeadlineToGoogleCalendar = async (deadline) => {
    try {
        // Get the course to find enrolled students
        const course = await Course.findById(deadline.course_id).populate('student_ids');

        if (!course || !course.student_ids || course.student_ids.length === 0) {
            console.log('No students enrolled in this course');
            return;
        }

        // Prepare event data
        const eventData = {
            title: `${deadline.title} - ${course.name}`,
            description: `${deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)} for ${course.name}\nDifficulty: ${deadline.difficulty}/5`,
            startTime: new Date(deadline.deadline_date).toISOString(),
            endTime: new Date(new Date(deadline.deadline_date).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
            timeZone: 'UTC'
        };

        // Sync to each student's Google Calendar
        const syncPromises = course.student_ids.map(async (student) => {
            try {
                const userId = student._id.toString();

                // Check if student has connected Google Calendar
                const isConnected = await googleCalendarService.isCalendarConnected(userId);

                if (isConnected) {
                    await googleCalendarService.createCalendarEvent(userId, eventData);
                    console.log(`Synced deadline to Google Calendar for student: ${userId}`);
                }
            } catch (error) {
                console.error(`Failed to sync for student ${student._id}:`, error.message);
                // Continue with other students even if one fails
            }
        });

        await Promise.allSettled(syncPromises);
        console.log(`Deadline sync completed for ${course.student_ids.length} students`);
    } catch (error) {
        console.error('Error syncing deadline to Google Calendar:', error);
        // Don't throw - we don't want to fail deadline creation if Google sync fails
    }
};

/**
 * Update a deadline in Google Calendar for all enrolled students
 * @param {Object} deadline - The updated deadline object
 * @param {String} googleEventId - The Google Calendar event ID (if stored)
 */
const updateDeadlineInGoogleCalendar = async (deadline, googleEventId) => {
    try {
        // Similar to sync, but update instead of create
        const course = await Course.findById(deadline.course_id).populate('student_ids');

        if (!course || !course.student_ids || course.student_ids.length === 0) {
            return;
        }

        const eventData = {
            title: `${deadline.title} - ${course.name}`,
            description: `${deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)} for ${course.name}\nDifficulty: ${deadline.difficulty}/5`,
            startTime: new Date(deadline.deadline_date).toISOString(),
            endTime: new Date(new Date(deadline.deadline_date).getTime() + 60 * 60 * 1000).toISOString(),
            timeZone: 'UTC'
        };

        // Note: This is a simplified version. In production, you'd want to store
        // the Google event ID for each student to update the correct event
        console.log('Deadline update in Google Calendar not fully implemented - requires event ID tracking');
    } catch (error) {
        console.error('Error updating deadline in Google Calendar:', error);
    }
};

/**
 * Delete a deadline from Google Calendar for all enrolled students
 * @param {String} deadlineId - The deadline ID
 * @param {String} googleEventId - The Google Calendar event ID (if stored)
 */
const deleteDeadlineFromGoogleCalendar = async (deadlineId, googleEventId) => {
    try {
        // Note: This requires storing Google event IDs per student
        console.log('Deadline deletion from Google Calendar not fully implemented - requires event ID tracking');
    } catch (error) {
        console.error('Error deleting deadline from Google Calendar:', error);
    }
};

module.exports = {
    syncDeadlineToGoogleCalendar,
    updateDeadlineInGoogleCalendar,
    deleteDeadlineFromGoogleCalendar
};
