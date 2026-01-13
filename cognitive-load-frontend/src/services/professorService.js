import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const professorService = {
  async getDashboardData(professorId) {
    try {
      const response = await api.get(`/professor/${professorId}/dashboard`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  },

  async getCourses(professorId) {
    try {
      const response = await api.get(`/professor/${professorId}/courses`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },

  async getDeadlines(professorId, courseId) {
    try {
      const response = await api.get(`/professor/${professorId}/courses/${courseId}/deadlines`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch deadlines');
    }
  },

  async createDeadline(professorId, courseId, deadlineData) {
    try {
      const response = await api.post(`/professor/${professorId}/courses/${courseId}/deadlines`, deadlineData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create deadline');
    }
  },

  async updateDeadline(professorId, courseId, deadlineId, deadlineData) {
    try {
      const response = await api.put(`/professor/${professorId}/courses/${courseId}/deadlines/${deadlineId}`, deadlineData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update deadline');
    }
  },

  async deleteDeadline(professorId, courseId, deadlineId) {
    try {
      const response = await api.delete(`/professor/${professorId}/courses/${courseId}/deadlines/${deadlineId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete deadline');
    }
  },

  async getClassLoadOverview(professorId, courseId, startDate, endDate) {
    try {
      const response = await api.get(`/professor/${professorId}/courses/${courseId}/load-overview`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch class load overview');
    }
  },

  async getStudentsAtRisk(professorId, courseId) {
    try {
      const response = await api.get(`/professor/${professorId}/courses/${courseId}/students-at-risk`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch students at risk');
    }
  },

  async getConflictDetection(professorId, courseId) {
    try {
      const response = await api.get(`/professor/${professorId}/courses/${courseId}/conflicts`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch conflict detection');
    }
  },

  async getAIRecommendations(professorId, courseId) {
    try {
      const response = await api.get(`/professor/${professorId}/courses/${courseId}/ai-recommendations`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch AI recommendations');
    }
  },

  async applyAISuggestion(professorId, courseId, suggestionId, action) {
    try {
      const response = await api.post(`/professor/${professorId}/courses/${courseId}/ai-suggestions/${suggestionId}/apply`, {
        action
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to apply AI suggestion');
    }
  },

  async getAlternativeDates(professorId, courseId, deadlineId) {
    try {
      const response = await api.get(`/professor/${professorId}/courses/${courseId}/deadlines/${deadlineId}/alternatives`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch alternative dates');
    }
  }
};