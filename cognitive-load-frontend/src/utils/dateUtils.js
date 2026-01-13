// Date utility functions

export const dateUtils = {
  /**
   * Format date to readable string
   * @param {Date|string} date - Date to format
   * @param {string} format - Format type ('short', 'long', 'time', 'datetime')
   * @returns {string} Formatted date string
   */
  formatDate(date, format = 'short') {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }

    const options = {
      short: { month: 'short', day: 'numeric' },
      long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }
    };

    return d.toLocaleDateString('en-US', options[format] || options.short);
  },

  /**
   * Get relative time string (e.g., "2 days ago", "in 3 hours")
   * @param {Date|string} date - Date to compare
   * @returns {string} Relative time string
   */
  getRelativeTime(date) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));

    if (Math.abs(diffDays) >= 1) {
      if (diffDays > 0) {
        return diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`;
      } else {
        return Math.abs(diffDays) === 1 ? 'Yesterday' : `${Math.abs(diffDays)} days ago`;
      }
    } else if (Math.abs(diffHours) >= 1) {
      if (diffHours > 0) {
        return diffHours === 1 ? 'In 1 hour' : `In ${diffHours} hours`;
      } else {
        return Math.abs(diffHours) === 1 ? '1 hour ago' : `${Math.abs(diffHours)} hours ago`;
      }
    } else {
      if (diffMinutes > 0) {
        return diffMinutes <= 1 ? 'In a moment' : `In ${diffMinutes} minutes`;
      } else {
        return Math.abs(diffMinutes) <= 1 ? 'Just now' : `${Math.abs(diffMinutes)} minutes ago`;
      }
    }
  },

  /**
   * Check if date is today
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if date is today
   */
  isToday(date) {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  /**
   * Check if date is tomorrow
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if date is tomorrow
   */
  isTomorrow(date) {
    const d = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.toDateString() === tomorrow.toDateString();
  },

  /**
   * Check if date is this week
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if date is this week
   */
  isThisWeek(date) {
    const d = new Date(date);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return d >= startOfWeek && d <= endOfWeek;
  },

  /**
   * Get days until date
   * @param {Date|string} date - Target date
   * @returns {number} Number of days until date (negative if past)
   */
  getDaysUntil(date) {
    const d = new Date(date);
    const now = new Date();
    const diffTime = d.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Get start of day
   * @param {Date|string} date - Date
   * @returns {Date} Start of day
   */
  getStartOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Get end of day
   * @param {Date|string} date - Date
   * @returns {Date} End of day
   */
  getEndOfDay(date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /**
   * Add days to date
   * @param {Date|string} date - Base date
   * @param {number} days - Number of days to add
   * @returns {Date} New date
   */
  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /**
   * Get week dates (Sunday to Saturday)
   * @param {Date|string} date - Date within the week
   * @returns {Array} Array of dates for the week
   */
  getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(d.setDate(diff + i));
      weekDates.push(new Date(weekDate));
    }
    
    return weekDates;
  },

  /**
   * Format duration in hours to readable string
   * @param {number} hours - Duration in hours
   * @returns {string} Formatted duration
   */
  formatDuration(hours) {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    } else if (hours === 1) {
      return '1 hour';
    } else if (hours < 24) {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return m > 0 ? `${h}h ${m}m` : `${h} hours`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = Math.round(hours % 24);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} days`;
    }
  },

  /**
   * Get calendar month data
   * @param {number} year - Year
   * @param {number} month - Month (0-11)
   * @returns {Object} Calendar data with weeks and days
   */
  getCalendarMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const weeks = [];
    let currentWeek = [];
    
    for (let i = 0; i < 42; i++) { // 6 weeks max
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      currentWeek.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate)
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      if (currentDate > lastDay && currentWeek.length === 0) {
        break;
      }
    }
    
    return {
      year,
      month,
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long' }),
      weeks,
      firstDay,
      lastDay
    };
  }
};