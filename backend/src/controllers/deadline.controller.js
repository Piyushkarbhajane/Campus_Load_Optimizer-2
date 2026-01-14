const Deadline = require("../models/deadline");
const Course = require("../models/course");
const ProfessorConflictService = require("../services/professorService");
const deadlineSync = require("../services/deadlineSync");

exports.createDeadline = async (req, res) => {
  try {
    // Normalize the type to lowercase to handle any case variations
    const deadlineData = {
      ...req.body,
      type: req.body.type?.toLowerCase()
    };

    const deadline = await Deadline.create(deadlineData);

    // Analyze deadline impact (existing functionality)
    ProfessorConflictService
      .analyzeDeadlineImpact(deadline)
      .catch(err => console.error('Conflict analysis failed:', err));

    // Sync to Google Calendar for enrolled students (new functionality)
    deadlineSync
      .syncDeadlineToGoogleCalendar(deadline)
      .catch(err => console.error('Google Calendar sync failed:', err));

    res.status(201).json({
      success: true,
      deadline
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeadlines = async (req, res) => {
  const deadlines = await Deadline.find();
  res.json(deadlines);
};

exports.updateDeadline = async (req, res) => {
  const updated = await Deadline.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteDeadline = async (req, res) => {
  await Deadline.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

exports.getDeadlinesByUserId = async (userId) => {
  // Step 1: Find courses where the user is enrolled or teaching
  const courses = await Course.find({
    $or: [
      { professor_id: userId },
      { student_ids: userId }
    ]
  }).select('_id');

  const courseIds = courses.map(course => course._id);

  // Step 2: Find deadlines for those courses
  return await Deadline.find({
    course_id: { $in: courseIds }
  })
    .populate('course_id', 'name')
    .sort({ deadline_date: 1 });
}

exports.getAssignmentDeadlinesByUserId = async (userId) => {
  // Step 1: Find relevant courses
  const courses = await Course.find({
    $or: [
      { professor_id: userId },
      { student_ids: userId }
    ]
  }).select('_id');

  const courseIds = courses.map(course => course._id);

  // Step 2: Find only assignment deadlines
  return await Deadline.find({
    course_id: { $in: courseIds },
    type: 'assignment'
  })
    .populate('course_id', 'name')
    .sort({ deadline_date: 1 });
}

