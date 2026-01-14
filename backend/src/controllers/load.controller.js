const Deadline = require("../models/deadline");
const StudentLoad = require("../models/studentLoad");
const loadCalculator = require("../services/loadCalculator"); // ✅ Import the entire module
const User = require("../models/user");
const Course = require("../models/course"); // ✅ Add this import

exports.getLoad = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const student = await User.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // ✅ Find courses where student is enrolled
    const courses = await Course.find({
      student_ids: req.params.studentId
    });

    const courseIds = courses.map(course => course._id);

    // ✅ Find deadlines for those courses
    const deadlines = await Deadline.find({
      course_id: { $in: courseIds }
    }).populate('course_id', 'name');

    // ✅ Use loadCalculator.calculateLoadRange (not destructured)
    const loadData = loadCalculator.calculateLoadRange(
      deadlines,
      new Date(),
      parseInt(days)
    );

    res.json({
      success: true,
      loadData,
      peakDays: loadCalculator.findPeakLoadDays(loadData) // ✅ Now this will work
    });

  } catch (error) {
    console.error('Error in load calculation:', error);
    res.status(500).json({ error: error.message });
  }
};