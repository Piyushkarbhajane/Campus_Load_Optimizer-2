const { schedule } = require('node-cron');
const loadCalculator = require('./loadCalculator');
const aiService = require('./aiService');
const StudentLoad = require('../models/studentLoad');
const User = require('../models/user');
const Deadline = require('../models/deadline');
const Course = require('../models/course');

/**
 * Run every day at 6:00 AM
 * Cron format: minute hour day month dayOfWeek
 */
const dailyLoadJob = async () => {
  console.log('🤖 Running daily load calculation job...');
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all students
    const students = await User.find({ role: 'student' });
    console.log(`📊 Processing ${students.length} students...`);

    let processedCount = 0;
    let tipsGenerated = 0;

    for (const student of students) {
      try {
        
        // Get student's deadlines
       const courses = await Course.find({ student_ids: student._id });
       console.log(`     - Student ${student._id}: Enrolled in ${courses.length} courses`);
       const courseIds = courses.map(c => c._id);

         const deadlines = await Deadline.find({
        course_id: { $in: courseIds }
        }).populate('course_id', 'name');
        console.log(`     - Student ${student._id}: Found ${deadlines.length} deadlines`);

        // Calculate today's load
        const todayLoad = loadCalculator.calculateDailyLoad(deadlines, today);

        // Save to database (upsert)
        await StudentLoad.findOneAndUpdate(
          {
            student_id: student._id,
            date: today
          },
          {
            student_id: student._id,
            date: today,
            load_score: todayLoad.load_score,
            risk_level: todayLoad.risk_level,
            deadlines_count: todayLoad.deadlines_count,
            deadlines: todayLoad.deadlines
          },
          {
            upsert: true,
            new: true
          }
        );

        processedCount++;

        // Generate AI tip if high load
        if (todayLoad.risk_level === 'danger' || todayLoad.risk_level === 'warning') {
          const loadData = loadCalculator.calculateLoadRange(deadlines, today, 7);
         await aiService.generateStudentTip(student, loadData);
          tipsGenerated++;
        }

      } catch (studentError) {
        console.error(`Error processing student ${student._id}:`, studentError.message);
      }
    }

    console.log(`✅ Daily load calculation complete!`);
    console.log(`   - Processed: ${processedCount} students`);
    console.log(`   - Generated: ${tipsGenerated} AI tips`);

  } catch (error) {
    console.error('❌ Error in daily load calculation job:', error);
  }
};

const runNow = async () => {
  console.log('🔧 Manually triggering daily load calculation...');
  await dailyLoadJob();
};
const job = schedule(
  '0 6 * * *',
  dailyLoadJob,
  { timezone: 'Asia/Kolkata' }
);

module.exports = {
  job,
  runNow
};
