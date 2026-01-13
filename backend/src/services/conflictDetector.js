class ConflictDetector {
  /**
   * Detect deadline conflicts
   */
  detectConflicts(deadlines) {
    if (!deadlines || !Array.isArray(deadlines)) {
      console.warn('detectConflicts: Invalid deadlines array');
      return [];
    }

    if (deadlines.length === 0) {
      console.log('detectConflicts: No deadlines to check');
      return [];
    }

    // ✅ DEBUG: Check if course_id is populated
    console.log('=== CONFLICT DETECTOR DEBUG ===');
    console.log('Total deadlines:', deadlines.length);
    console.log('First deadline structure:', JSON.stringify(deadlines[0], null, 2));
    console.log('course_id type:', typeof deadlines[0].course_id);
    console.log('course_id value:', deadlines[0].course_id);
    console.log('================================');

    const deadlinesByDate = this.groupByDate(deadlines);
    
    const conflicts = [];

    for (const [date, items] of Object.entries(deadlinesByDate)) {
      if (items.length > 1) {
        conflicts.push({
          date,
          count: items.length,
          deadlines: items.map(d => {
            // ✅ Better course name extraction
            let courseName = 'Unknown Course';
            let courseId = null;

            if (d.course_id) {
              if (typeof d.course_id === 'object' && d.course_id.name) {
                // Populated
                courseName = d.course_id.name;
                courseId = d.course_id._id;
              } else if (typeof d.course_id === 'object' && d.course_id._id) {
                // Populated but no name
                courseId = d.course_id._id;
              } else {
                // Not populated (just ObjectId string)
                courseId = d.course_id;
              }
            }

            console.log(`Deadline: ${d.title}, Course ID: ${courseId}, Course Name: ${courseName}`);

            return {
              id: d._id,
              title: d.title,
              type: d.type,
              difficulty: d.difficulty,
              course_id: courseId,
              course_name: courseName
            };
          }),
          severity: this.calculateSeverity(items),
          total_difficulty: items.reduce((sum, d) => sum + (d.difficulty || 0), 0)
        });
      }
    }

    return conflicts.sort((a, b) => b.total_difficulty - a.total_difficulty);
  }

  groupByDate(deadlines) {
    const grouped = {};

    deadlines.forEach(deadline => {
      if (!deadline.deadline_date) {
        console.warn('Deadline missing deadline_date:', deadline);
        return;
      }

      const date = new Date(deadline.deadline_date).toISOString().split('T')[0];
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(deadline);
    });

    return grouped;
  }

  calculateSeverity(deadlines) {
    const count = deadlines.length;
    const hasExam = deadlines.some(d => d.type === 'exam');
    const avgDifficulty = deadlines.reduce((sum, d) => sum + (d.difficulty || 0), 0) / count;

    if (hasExam && count >= 2) return 'critical';
    if (count >= 3) return 'high';
    if (avgDifficulty >= 4) return 'high';
    return 'medium';
  }

  suggestAlternativeDates(conflict, allDeadlines, daysRange = 14) {
    if (!conflict || !conflict.date) {
      console.warn('suggestAlternativeDates: Invalid conflict');
      return [];
    }

    if (!allDeadlines || !Array.isArray(allDeadlines)) {
      console.warn('suggestAlternativeDates: Invalid allDeadlines array');
      return [];
    }

    const conflictDate = new Date(conflict.date);
    const suggestions = [];

    for (let offset = -daysRange / 2; offset <= daysRange / 2; offset++) {
      if (offset === 0) continue;

      const alternativeDate = new Date(conflictDate);
      alternativeDate.setDate(alternativeDate.getDate() + offset);
      const altDateStr = alternativeDate.toISOString().split('T')[0];

      const deadlinesOnAltDate = allDeadlines.filter(d => {
        if (!d.deadline_date) return false;
        return new Date(d.deadline_date).toISOString().split('T')[0] === altDateStr;
      });

      suggestions.push({
        date: altDateStr,
        existing_deadlines: deadlinesOnAltDate.length,
        days_from_conflict: offset,
        suitability_score: this.calculateSuitability(
          deadlinesOnAltDate.length,
          Math.abs(offset)
        )
      });
    }

    return suggestions
      .sort((a, b) => b.suitability_score - a.suitability_score)
      .slice(0, 3);
  }

  calculateSuitability(existingDeadlines, daysAway) {
    const loadScore = Math.max(0, 10 - existingDeadlines * 3);
    const proximityScore = Math.max(0, 10 - daysAway);
    return loadScore + proximityScore;
  }
}

module.exports = new ConflictDetector();