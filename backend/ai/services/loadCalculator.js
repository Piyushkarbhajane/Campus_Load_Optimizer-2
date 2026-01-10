class LoadCalculator {
  constructor() {
    // Difficulty weights (1-5 scale)
    this.difficultyWeights = {
      1: 10,  // Very Easy
      2: 15,  // Easy
      3: 20,  // Medium
      4: 25,  // Hard
      5: 30   // Very Hard
    };

    // Type multipliers
    this.typeWeights = {
      assignment: 1.0,
      project: 1.5,
      exam: 2.0
    };
  }

  /**
   * Calculate load for a specific date
   * @param {Array} deadlines
   * @param {Date} targetDate
   * @returns {Object}
   */
  calculateDailyLoad(deadlines, targetDate) {
    let totalLoad = 0;
    const relevantDeadlines = [];

    deadlines.forEach(deadline => {
      const daysUntil = this.getDaysUntil(deadline.deadline_date, targetDate);

      if (daysUntil >= 0 && daysUntil <= 14) {
        const loadPoints = this.calculateDeadlineLoad(deadline, daysUntil);
        totalLoad += loadPoints;

        relevantDeadlines.push({
          deadline_id: deadline._id,
          title: deadline.title,
          course_name: deadline.course_name || 'Unknown Course',
          days_until: daysUntil,
          load_points: Math.round(loadPoints * 10) / 10,
          difficulty: deadline.difficulty,
          type: deadline.type
        });
      }
    });

    const finalLoad = Math.min(Math.round(totalLoad), 100);

    return {
      load_score: finalLoad,
      risk_level: this.getRiskLevel(finalLoad),
      deadlines_count: relevantDeadlines.length,
      deadlines: relevantDeadlines.sort((a, b) => a.days_until - b.days_until)
    };
  }

  calculateDeadlineLoad(deadline, daysUntil) {
    const basePoints = this.difficultyWeights[deadline.difficulty] || 20;
    const typeMultiplier = this.typeWeights[deadline.type] || 1.0;

    let proximityFactor;
    if (daysUntil === 0) {
      proximityFactor = 3.0;
    } else if (daysUntil === 1) {
      proximityFactor = 2.5;
    } else if (daysUntil <= 3) {
      proximityFactor = 2.0;
    } else if (daysUntil <= 7) {
      proximityFactor = 1.5;
    } else {
      proximityFactor = 14 / (daysUntil + 1);
    }

    return basePoints * typeMultiplier * proximityFactor;
  }

  calculateLoadRange(deadlines, startDate = new Date(), days = 30) {
    const loadData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const dailyLoad = this.calculateDailyLoad(deadlines, date);

      loadData.push({
        date: date.toISOString().split('T')[0],
        ...dailyLoad
      });
    }

    return loadData;
  }

  calculateClassAverageLoad(allStudentsDeadlines, date) {
    if (allStudentsDeadlines.length === 0) return 0;

    const totalLoad = allStudentsDeadlines.reduce((sum, studentDeadlines) => {
      const { load_score } = this.calculateDailyLoad(studentDeadlines, date);
      return sum + load_score;
    }, 0);

    return Math.round(totalLoad / allStudentsDeadlines.length);
  }

  getRiskLevel(loadScore) {
    if (loadScore >= 70) return 'danger';
    if (loadScore >= 40) return 'warning';
    return 'safe';
  }

  getDaysUntil(deadlineDate, currentDate) {
    const deadline = new Date(deadlineDate);
    const current = new Date(currentDate);

    deadline.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    const diffTime = deadline - current;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  findPeakLoadDays(loadData, threshold = 60) {
    return loadData
      .filter(day => day.load_score >= threshold)
      .sort((a, b) => b.load_score - a.load_score);
  }
}

module.exports = new LoadCalculator();
