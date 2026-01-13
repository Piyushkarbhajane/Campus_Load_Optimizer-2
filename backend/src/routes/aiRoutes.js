const { Router } = require('express');
const aiService = require('../services/aiService');
const loadCalculator = require('../services/loadCalculator');
const conflictDetector = require('../services/conflictDetector');

const User = require('../models/user');
const Course = require('../models/course');
const Deadline = require('../models/deadline');
const StudentLoad = require('../models/studentLoad');

const router = Router();

/**
 * POST /ai/student-tip
 * Generate AI tip for student
 */
router.post('/student-tip', async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find courses where this student is enrolled
    const courses = await Course.find({
      student_ids: studentId
    });

    const courseIds = courses.map(course => course._id);

    // Get deadlines for those courses with populated course_id
    const deadlines = await Deadline.find({
      course_id: { $in: courseIds }
    }).populate('course_id', 'name'); // ✅ This populates course name

    console.log('Found courses:', courseIds.length);
    console.log('Found deadlines:', deadlines.length);

    // Calculate load for next 7 days
    const loadData = loadCalculator.calculateLoadRange(deadlines, new Date(), 7);

    // Generate AI tip
    const tipResult = await aiService.generateStudentTip(student, loadData);

    res.json({
      success: true,
      tip: tipResult.tip,
      tip_id: tipResult.tip_id,
      priority: tipResult.priority,
      loadData
    });

  } catch (error) {
    console.error('Error in student-tip:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /ai/professor-suggestion
 * Generate suggestions for professor
 */
router.post('/professor-suggestion', async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const course = await Course.findById(courseId).populate('professor_id', 'name');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // ✅ POPULATE course_id when fetching deadlines
    const deadlines = await Deadline.find({ 
      course_id: courseId 
    }).populate('course_id', 'name'); // ✅ Add this populate

    console.log('Found deadlines for course:', deadlines.length);
    console.log('Sample deadline:', deadlines[0]); // Debug

    // Detect conflicts
    const conflicts = conflictDetector.detectConflicts(deadlines);

    // Calculate class average load for next 14 days
    const classLoadData = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get all students in this course
      const students = course.student_ids;

      if (students.length > 0) {
        // Get deadlines for all students on this date
        const studentCourses = await Course.find({
          student_ids: { $in: students }
        });

        const allCourseIds = studentCourses.map(c => c._id);

        const dailyDeadlines = await Deadline.find({
          course_id: { $in: allCourseIds },
          deadline_date: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        }).populate('course_id', 'name');

        // Calculate average load using loadCalculator
        let totalLoad = 0;
        for (const studentId of students) {
          // Get courses for this student
          const studentCourses = await Course.find({
            student_ids: studentId
          });
          
          const studentCourseIds = studentCourses.map(c => c._id);
          
          // Get deadlines for this student
          const studentDeadlines = await Deadline.find({
            course_id: { $in: studentCourseIds }
          }).populate('course_id', 'name');

          // Calculate load for this student on this date
          const dailyLoad = loadCalculator.calculateDailyLoad(studentDeadlines, date);
          totalLoad += dailyLoad.load_score;
        }

        const avgLoad = students.length > 0 ? Math.round(totalLoad / students.length) : 0;

        classLoadData.push({
          date: startOfDay.toISOString().split('T')[0],
          average_load: avgLoad
        });
      } else {
        classLoadData.push({
          date: startOfDay.toISOString().split('T')[0],
          average_load: 0
        });
      }
    }

    // Generate AI suggestion
    const courseData = {
      _id: course._id,
      name: course.name,
      professor_id: course.professor_id,
      deadlines
    };

    const suggestion = await aiService.generateProfessorSuggestion(
      courseData,
      classLoadData,
      conflicts
    );

    res.json({
      success: true,
      suggestion,
      classLoadData,
      conflicts
    });

  } catch (error) {
    console.error('Error in professor-suggestion:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /ai/conflicts/:courseId
 * Get deadline conflicts for a course
 */
router.get('/conflicts/:courseId', async (req, res) => {
  try {
    // ✅ ADD POPULATE HERE
    const deadlines = await Deadline.find({
      course_id: req.params.courseId
    }).populate('course_id', 'name'); // ✅ This will fix "Unknown Course"

    console.log('Found deadlines for conflict detection:', deadlines.length);
    if (deadlines.length > 0) {
      console.log('Sample deadline with course:', deadlines[0]);
    }

    const conflicts = conflictDetector.detectConflicts(deadlines);

    // Get alternative dates for each conflict
    const conflictsWithSuggestions = conflicts.map(conflict => ({
      ...conflict,
      suggested_dates: conflictDetector.suggestAlternativeDates(conflict, deadlines)
    }));

    res.json({
      success: true,
      conflicts: conflictsWithSuggestions
    });

  } catch (error) {
    console.error('Error in conflicts:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /ai/tips/:userId
 * Get recent AI tips for a user
 */
router.get('/tips/:userId', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const tips = await aiService.getUserTips(
      req.params.userId,
      parseInt(limit)
    );

    res.json({
      success: true,
      tips
    });

  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /ai/tips/:tipId/read
 * Mark tip as read
 */
router.put('/tips/:tipId/read', async (req, res) => {
  try {
    const tip = await aiService.markTipAsRead(req.params.tipId);

    res.json({
      success: true,
      tip
    });

  } catch (error) {
    console.error('Error marking tip as read:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;