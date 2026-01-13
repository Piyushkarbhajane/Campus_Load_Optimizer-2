const { chat } = require('../config/openai.config');
const AiTip = require('../models/aiTip');
const { studentTipPrompt, professorSuggestionPrompt } = require('../utils/aiPrompts');

class AIService {
  /**
   * Generate personalized tip for student
   */
  async generateStudentTip(studentData, loadData) {
    try {
      // ✅ Validate inputs
      if (!studentData || !studentData._id) {
        throw new Error('Invalid student data');
      }

      if (!loadData || !Array.isArray(loadData)) {
        console.warn('No load data provided, generating positive tip');
        return this.generatePositiveTip(studentData);
      }

      // Filter high-load days
      const highLoadDays = loadData.filter(d => d.load_score >= 40);
      
      if (highLoadDays.length === 0) {
        console.log('No high load days, generating positive tip');
        return this.generatePositiveTip(studentData);
      }

      const prompt = studentTipPrompt(
        studentData.name,
        highLoadDays
      );

      console.log('Generating AI tip for student:', studentData.name);

      const completion = await chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a supportive academic advisor helping students manage their workload. Be encouraging but realistic."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      const tipText = completion.choices[0].message.content;
      
      // Save tip to database
      const savedTip = await AiTip.create({
        user_id: studentData._id,
        tip_text: tipText,
        tip_type: 'student_workload',
        metadata: {
          load_score: highLoadDays[0].load_score,
          risk_level: highLoadDays[0].risk_level,
          affected_dates: highLoadDays.map(d => d.date),
          priority: highLoadDays[0].risk_level === 'danger' ? 'high' : 'medium'
        }
      });

      return {
        tip: tipText,
        tip_id: savedTip._id,
        priority: savedTip.metadata.priority
      };

    } catch (error) {
      console.error('Error generating student tip:', error);
      
      // ✅ Fallback to positive tip if AI fails
      if (error.message.includes('OpenAI') || error.message.includes('API')) {
        console.log('OpenAI API failed, using fallback');
        return this.generatePositiveTip(studentData);
      }
      
      throw error;
    }
  }

  /**
   * Generate positive tip for students with low load
   */
  async generatePositiveTip(studentData) {
    try {
      // ✅ Validate student data
      if (!studentData || !studentData._id || !studentData.name) {
        throw new Error('Invalid student data for positive tip');
      }

      const encouragements = [
        `Great job, ${studentData.name}! Your workload is well-managed. This is a perfect time to review past material or get ahead on readings.`,
        `You're doing excellent, ${studentData.name}! With light workload ahead, consider helping classmates or exploring extra credit opportunities.`,
        `Awesome balance, ${studentData.name}! Use this lighter period to recharge and prepare for busier times ahead.`
      ];

      const randomTip = encouragements[Math.floor(Math.random() * encouragements.length)];

      const savedTip = await AiTip.create({
        user_id: studentData._id,
        tip_text: randomTip,
        tip_type: 'study_tips',
        metadata: {
          load_score: 0,
          risk_level: 'safe',
          priority: 'low'
        }
      });

      return { 
        tip: randomTip, 
        tip_id: savedTip._id,
        priority: 'low' 
      };

    } catch (error) {
      console.error('Error generating positive tip:', error);
      throw error;
    }
  }

  /**
   * Generate suggestions for professor
   */
  async generateProfessorSuggestion(courseData, classLoadData, conflicts) {
    try {
      // ✅ Validate inputs
      if (!courseData || !courseData._id) {
        throw new Error('Invalid course data');
      }

      if (!courseData.professor_id) {
        throw new Error('Course missing professor_id');
      }

      if (!classLoadData || !Array.isArray(classLoadData)) {
        throw new Error('Invalid class load data');
      }

      if (!courseData.deadlines || !Array.isArray(courseData.deadlines)) {
        throw new Error('Invalid deadlines data');
      }

      console.log('Generating professor suggestion for course:', courseData.name);
      console.log('Class load days:', classLoadData.length);
      console.log('Deadlines:', courseData.deadlines.length);
      console.log('Conflicts:', conflicts ? conflicts.length : 0);

      const overloadedDays = classLoadData.filter(d => d.average_load >= 60);

      const prompt = professorSuggestionPrompt(
        courseData.name,
        overloadedDays,
        courseData.deadlines,
        conflicts || []
      );

      const completion = await chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant helping professors optimize course scheduling. Be professional and data-driven."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      });

      const suggestion = completion.choices[0].message.content;

      // ✅ Extract professor_id correctly (handle if it's populated)
      const professorId = courseData.professor_id._id || courseData.professor_id;

      // Save suggestion
      await AiTip.create({
        user_id: professorId,
        tip_text: suggestion,
        tip_type: 'professor_suggestion',
        metadata: {
          course_id: courseData._id,
          affected_dates: overloadedDays.map(d => d.date),
          priority: overloadedDays.length > 3 ? 'high' : 'medium'
        }
      });

      return suggestion;

    } catch (error) {
      console.error('Error generating professor suggestion:', error);
      console.error('Course data:', courseData);
      throw error;
    }
  }

  /**
   * Get recent tips for a user
   */
  async getUserTips(userId, limit = 5) {
    try {
      return await AiTip.find({
        user_id: userId,
        expires_at: { $gt: new Date() }
      })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error fetching user tips:', error);
      throw error;
    }
  }

  /**
   * Mark tip as read
   */
  async markTipAsRead(tipId) {
    try {
      return await AiTip.findByIdAndUpdate(
        tipId,
        { is_read: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking tip as read:', error);
      throw error;
    }
  }
}

module.exports = new AIService();