const Deadline = require('../models/deadline');
const Course = require('../models/course');
const ConflictDetector = require('./conflictDetector');
const AIService = require('./aiService');

class ProfessorConflictService {
  async analyzeDeadlineImpact(newDeadline) {
    try {
      // 1. Find the course
      const course = await Course.findById(newDeadline.course_id);
      if (!course) {
        console.warn(`Course not found for deadline: ${newDeadline._id}`);
        return;
      }
      console.log(`Analyzing conflicts for course: ${course.name}`);

      // 2. Get all students enrolled in this course
      const studentIds = course.student_ids || [];
      if (studentIds.length === 0) {
        console.log(`No students enrolled in course: ${course.name}`);
        return;
      }
      console.log(`Course ${course.name} has ${studentIds.length} enrolled students`);

      // 3. Find ALL courses taken by these students
      const relatedCourses = await Course.find({
        student_ids: { $in: studentIds }
      }).select('_id');

      const relatedCourseIds = relatedCourses.map(c => c._id);

      // 4. Fetch ALL deadlines across those courses
      const allDeadlines = await Deadline.find({
        course_id: { $in: relatedCourseIds }
      }).populate('course_id', 'name professor_id');

      // 5. Detect conflicts globally (by date)
      const conflicts = ConflictDetector.detectConflicts(allDeadlines);
    
      if (conflicts.length === 0) {
        console.log('No conflicts detected');
        return;
      }
      console.log(`Detected ${conflicts.length} conflicts related to course: ${course.name}`);

      // 6. For each conflict involving THIS course, suggest alternatives
      // ✅ FIXED: Compare using course IDs, not names
      const relevantConflicts = conflicts.filter(conflict =>
        conflict.deadlines.some(d => {
          // Handle both populated and unpopulated course_id
          const deadlineCourseId = d.course_id?._id || d.course_id;
          return String(deadlineCourseId) === String(course._id);
        })
      );
      
      console.log(`Found ${relevantConflicts.length} relevant conflicts for course: ${course.name}`);
      
      if (relevantConflicts.length === 0) return;

      const conflictSuggestions = relevantConflicts.map(conflict => ({
        conflict,
        alternatives: ConflictDetector.suggestAlternativeDates(
          conflict,
          allDeadlines
        )
      }));
      
      console.log(`Generated suggestions for ${conflictSuggestions.length} conflicts for course: ${course.name}`);

      // 7. Generate AI suggestion for professor
      await AIService.generateProfessorSuggestion(
        {
          _id: course._id,
          name: course.name,
          professor_id: course.professor_id,
          deadlines: allDeadlines.filter(d => 
            String(d.course_id?._id || d.course_id) === String(course._id)
          )
        },
        [], // classLoadData optional here
        conflictSuggestions
      );
      
    } catch (error) {
      console.error('Error in analyzeDeadlineImpact:', error);
      throw error;
    }
  }
}

module.exports = new ProfessorConflictService();