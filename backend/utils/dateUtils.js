/**
 * 🗓️ Get the Current Week in "YYYY-WW" format
 * Example: "2025-W08"
 */
export const getCurrentWeek = () => {
    const now = new Date();
    const year = now.getFullYear();
  
    // Calculate the week number
    const firstDayOfYear = new Date(year, 0, 1);
    const daysPassed = Math.floor((now - firstDayOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((daysPassed + firstDayOfYear.getDay() + 1) / 7);
  
    return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
  };
  
  /**
   * 🗓️ Get the Week Number for a Given Date
   * @param {Date} date - Date object
   * @returns {string} - Week in "YYYY-WW" format
   */
  export const getWeekForDate = (date) => {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const daysPassed = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((daysPassed + firstDayOfYear.getDay() + 1) / 7);
    return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
  };
  
  /**
   * 🗓️ Get Start and End Dates of a Given Week
   * @param {string} week - Week in "YYYY-WW" format
   * @returns {{ startDate: Date, endDate: Date }}
   */
  export const getWeekDateRange = (week) => {
    const [year, weekNum] = week.split("-W").map(Number);
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOffset = ((weekNum - 1) * 7) - firstDayOfYear.getDay() + 1;
  
    const startDate = new Date(year, 0, 1 + dayOffset);
    const endDate = new Date(year, 0, 1 + dayOffset + 6);
  
    return { startDate, endDate };
  };
  