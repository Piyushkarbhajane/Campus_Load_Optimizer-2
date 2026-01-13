// services/api.js
class APIService {
  constructor() {
    this.baseURL = 'http://localhost:5000';
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(options.auth !== false)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async signup(email, password, name, role = 'student') {
    return this.request('/auth/signup', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password, name, role })
    });
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password })
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Courses
  async getCourses() {
    return this.request('/courses');
  }

  async createCourse(name, professorId, studentIds) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify({
        name,
        professor_id: professorId,
        student_ids: studentIds
      })
    });
  }

  // Deadlines
  async getDeadlines() {
    return this.request('/deadlines');
  }

  async createDeadline(title, courseId, deadlineDate, difficulty, type) {
    return this.request('/deadlines', {
      method: 'POST',
      body: JSON.stringify({
        title,
        course_id: courseId,
        deadline_date: deadlineDate,
        difficulty,
        type
      })
    });
  }

  async updateDeadline(deadlineId, updates) {
    return this.request(`/deadlines/${deadlineId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteDeadline(deadlineId) {
    return this.request(`/deadlines/${deadlineId}`, {
      method: 'DELETE'
    });
  }

  // Student Load
  async getStudentLoad(studentId, days = 30) {
    return this.request(`/load/${studentId}?days=${days}`);
  }

  // AI
  async getStudentTip(studentId) {
    return this.request('/ai/student-tip', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ studentId })
    });
  }

  async getProfessorSuggestion(courseId) {
    return this.request('/ai/professor-suggestion', {
      method: 'POST',
        auth: false,
        body: JSON.stringify({ courseId })
    });
  }

  async getUserTips(userId) {
    return this.request(`/ai/user-tips/${userId}`, {
      auth: false
    });
  }

  async getCourseConflicts(courseId) {
    return this.request(`/ai/conflicts/${courseId}`, {
      auth: false
    });
  }
}

export default new APIService();