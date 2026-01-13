import axios from 'axios';
import { mockData, generateCalendarData } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Check if user is using demo account
const isDemoUser = () => {
  const token = localStorage.getItem('token');
  return token && token.startsWith('demo_token_');
};

// Get demo user data
const getDemoUser = () => {
  const demoUser = localStorage.getItem('demo_user');
  return demoUser ? JSON.parse(demoUser) : null;
};

export const studentService = {
  async getDashboardData() {
    if (isDemoUser()) {
      const user = getDemoUser();
      if (user && user.mockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter assignments for upcoming deadlines (next 14 days)
        const now = new Date();
        const twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
        
        const upcomingDeadlines = user.mockData.assignments.filter(assignment => {
          const dueDate = new Date(assignment.dueDate);
          return dueDate >= now && dueDate <= twoWeeksFromNow && assignment.status !== 'completed';
        });

        // Filter assignments for today
        const today = now.toISOString().split('T')[0];
        const todayDeadlines = user.mockData.assignments.filter(assignment => 
          assignment.dueDate === today && assignment.status !== 'completed'
        );

        // Mock study progress
        const studyProgress = [
          { course: 'CS 301', completed: 3, total: 5, percentage: 60 },
          { course: 'CS 201', completed: 4, total: 6, percentage: 67 },
          { course: 'MATH 250', completed: 2, total: 4, percentage: 50 },
          { course: 'ENG 102', completed: 1, total: 3, percentage: 33 }
        ];

        // Mock AI recommendations
        const aiRecommendations = [
          {
            id: 1,
            type: 'schedule',
            title: 'Optimal Study Time',
            message: 'Based on your patterns, you\'re most productive between 2-4 PM.',
            priority: 'high'
          },
          {
            id: 2,
            type: 'workload',
            title: 'Break Recommendation',
            message: 'Take a 15-minute break to maintain focus.',
            priority: 'medium'
          }
        ];
        
        return {
          profile: user.mockData.profile,
          courses: user.mockData.courses,
          assignments: user.mockData.assignments,
          upcomingDeadlines,
          todayDeadlines,
          personalEvents: user.mockData.personalEvents,
          notifications: user.mockData.notifications,
          aiTips: user.mockData.aiTips,
          aiRecommendations,
          studyProgress
        };
      }
    }

    try {
      const response = await api.get('/student/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  async getCalendarData(year, month) {
    if (isDemoUser()) {
      const user = getDemoUser();
      if (user && user.mockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return generateCalendarData(year, month, user.mockData.assignments);
      }
    }

    try {
      const response = await api.get(`/student/calendar/${year}/${month}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch calendar data');
    }
  },

  async getAssignments() {
    if (isDemoUser()) {
      const user = getDemoUser();
      if (user && user.mockData) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return user.mockData.assignments;
      }
    }

    try {
      const response = await api.get('/student/assignments');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  },

  async addPersonalEvent(eventData) {
    if (isDemoUser()) {
      // Simulate adding to mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        id: Date.now(),
        ...eventData,
        type: 'personal'
      };
    }

    try {
      const response = await api.post('/student/events', eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add personal event');
    }
  },

  async markNotificationRead(notificationId) {
    if (isDemoUser()) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true };
    }

    try {
      const response = await api.patch(`/student/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
};