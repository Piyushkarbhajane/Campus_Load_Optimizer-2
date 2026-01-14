// Mock data for demo accounts
export const mockData = {
  student: {
    profile: {
      id: 1,
      name: 'Demo Student',
      email: 'student@demo.com',
      role: 'student',
      avatar: '/images/profile-1.jpg',
      year: 'Junior',
      major: 'Computer Science',
      gpa: 3.7
    },
    courses: [
      {
        id: 1,
        name: 'CS 301 - Algorithms',
        professor: 'Dr. Smith',
        credits: 3,
        color: '#3B82F6'
      },
      {
        id: 2,
        name: 'CS 201 - Data Structures',
        professor: 'Dr. Johnson',
        credits: 4,
        color: '#10B981'
      },
      {
        id: 3,
        name: 'MATH 250 - Statistics',
        professor: 'Dr. Brown',
        credits: 3,
        color: '#F59E0B'
      },
      {
        id: 4,
        name: 'ENG 102 - Technical Writing',
        professor: 'Prof. Davis',
        credits: 2,
        color: '#8B5CF6'
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Algorithm Analysis Project',
        courseId: 'CS 301',
        course: 'CS 301',
        dueDate: '2026-01-20',
        difficulty: 8,
        importance: 9,
        estimatedHours: 15,
        status: 'pending',
        type: 'Project',
        description: 'Implement and analyze sorting algorithms'
      },
      {
        id: 2,
        title: 'Binary Tree Implementation',
        courseId: 'CS 201',
        course: 'CS 201',
        dueDate: '2026-01-18',
        difficulty: 6,
        importance: 7,
        estimatedHours: 8,
        status: 'in-progress',
        type: 'Assignment',
        description: 'Create a balanced binary search tree'
      },
      {
        id: 3,
        title: 'Statistics Homework 3',
        courseId: 'MATH 250',
        course: 'MATH 250',
        dueDate: '2026-01-15',
        difficulty: 4,
        importance: 5,
        estimatedHours: 3,
        status: 'pending',
        type: 'Homework',
        description: 'Probability distributions and hypothesis testing'
      },
      {
        id: 4,
        title: 'Technical Report Draft',
        courseId: 'ENG 102',
        course: 'ENG 102',
        dueDate: '2026-01-22',
        difficulty: 5,
        importance: 6,
        estimatedHours: 6,
        status: 'pending',
        type: 'Report',
        description: 'Write a technical report on software engineering practices'
      },
      {
        id: 5,
        title: 'Database Design Quiz',
        courseId: 'CS 201',
        course: 'CS 201',
        dueDate: '2026-01-16',
        difficulty: 3,
        importance: 4,
        estimatedHours: 2,
        status: 'completed',
        type: 'Quiz',
        description: 'Quiz on normalization and ER diagrams'
      }
    ],
    personalEvents: [
      {
        id: 1,
        title: 'Study Group - Algorithms',
        date: '2026-01-14',
        time: '14:00',
        duration: 2,
        type: 'study'
      },
      {
        id: 2,
        title: 'Job Interview - Tech Corp',
        date: '2026-01-17',
        time: '10:00',
        duration: 1,
        type: 'interview'
      },
      {
        id: 3,
        title: 'Family Dinner',
        date: '2026-01-19',
        time: '18:00',
        duration: 2,
        type: 'personal'
      }
    ],
    notifications: [
      {
        id: 1,
        type: 'warning',
        title: 'High Load Alert',
        message: 'Your cognitive load for January 20th is critically high (95%). Consider rescheduling some tasks.',
        timestamp: '2026-01-12T10:30:00Z',
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'New Assignment Added',
        message: 'Dr. Smith added a new assignment for CS 301 - Algorithm Analysis Project.',
        timestamp: '2026-01-12T09:15:00Z',
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'Assignment Completed',
        message: 'Great job completing the Database Design Quiz! Your load for today decreased.',
        timestamp: '2026-01-11T16:45:00Z',
        read: true
      }
    ],
    aiTips: [
      {
        id: 1,
        type: 'schedule',
        title: 'Optimal Study Time',
        message: 'Based on your patterns, you\'re most productive between 2-4 PM. Schedule difficult tasks during this time.',
        priority: 'high'
      },
      {
        id: 2,
        type: 'workload',
        title: 'Break Recommendation',
        message: 'You\'ve been working for 3 hours straight. Take a 15-minute break to maintain focus.',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'deadline',
        title: 'Deadline Approaching',
        message: 'The Binary Tree Implementation is due in 6 days. Consider starting today to avoid last-minute stress.',
        priority: 'high'
      }
    ]
  },
  professor: {
    profile: {
      id: 2,
      name: 'Dr. Demo Professor',
      email: 'professor@demo.com',
      role: 'professor',
      avatar: '/images/profile-2.jpeg',
      department: 'Computer Science',
      title: 'Associate Professor'
    },
    courses: [
      {
        id: 1,
        name: 'CS 101 - Intro to Programming',
        students: 45,
        semester: 'Spring 2026',
        loadLevel: 'low'
      },
      {
        id: 2,
        name: 'CS 201 - Data Structures',
        students: 38,
        semester: 'Spring 2026',
        loadLevel: 'medium'
      },
      {
        id: 3,
        name: 'CS 301 - Algorithms',
        students: 32,
        semester: 'Spring 2026',
        loadLevel: 'high'
      },
      {
        id: 4,
        name: 'CS 401 - Senior Capstone',
        students: 15,
        semester: 'Spring 2026',
        loadLevel: 'low'
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Algorithm Analysis Project',
        course: 'CS 301',
        dueDate: '2026-01-20',
        studentsSubmitted: 12,
        totalStudents: 32,
        avgLoadImpact: 8.5
      },
      {
        id: 2,
        title: 'Binary Tree Implementation',
        course: 'CS 201',
        dueDate: '2026-01-18',
        studentsSubmitted: 25,
        totalStudents: 38,
        avgLoadImpact: 6.2
      }
    ],
    analytics: {
      totalStudents: 130,
      highLoadStudents: 8,
      upcomingDeadlines: 12,
      activeCourses: 4
    }
  },
  admin: {
    profile: {
      id: 3,
      name: 'Demo Admin',
      email: 'admin@demo.com',
      role: 'admin',
      avatar: '/images/profile-3.jpg',
      department: 'IT Administration'
    },
    systemStats: {
      totalStudents: 1247,
      activeProfessors: 89,
      systemLoad: 67,
      alerts: 23
    }
  }
};

// Calculate cognitive load for a given date
export const calculateCognitiveLoad = (assignments, date) => {
  const targetDate = new Date(date);
  let totalLoad = 0;
  
  assignments.forEach(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const daysUntilDue = Math.ceil((dueDate - targetDate) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue >= 0 && daysUntilDue <= 14) {
      // Load increases as deadline approaches
      const urgencyFactor = Math.max(0, (14 - daysUntilDue) / 14);
      const difficultyWeight = assignment.difficulty / 10;
      const importanceWeight = assignment.importance / 10;
      
      const assignmentLoad = urgencyFactor * difficultyWeight * importanceWeight * 100;
      totalLoad += assignmentLoad;
    }
  });
  
  return Math.min(100, Math.round(totalLoad));
};

// Generate calendar data for a month
export const generateCalendarData = (year, month, assignments) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarData = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    const load = calculateCognitiveLoad(assignments, dateString);
    
    let loadLevel = 'low';
    if (load >= 80) loadLevel = 'critical';
    else if (load >= 60) loadLevel = 'high';
    else if (load >= 40) loadLevel = 'moderate';
    
    calendarData.push({
      date: dateString,
      day,
      load,
      loadLevel,
      assignments: assignments.filter(a => a.dueDate === dateString)
    });
  }
  
  return calendarData;
};