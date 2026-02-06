import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Formats a date into a string based on the specified type.
 * @param {Date} date - The date to format.
 * @param {"minimal" | "long" | "base" | "relative"} type - The format type.
 * @returns {string} - The formatted date string.
 */
export default function formatDate(date: Date, type: "minimal" | "long" | "base" | "relative") {
  const dateFormatted = dayjs(date);
  
  switch (type) {
    case "minimal":
      return `${months[dateFormatted.month()].substring(0, 3)} ${dateFormatted.date()}, ${dateFormatted.year()}`;
    
    case "long":
      return `${dateFormatted.date()} ${months[dateFormatted.month()]} ${dateFormatted.year()}`;
    
    case "relative":
      const now = dayjs();
      const diffInSeconds = now.diff(dateFormatted, "second");
      const diffInMinutes = now.diff(dateFormatted, "minute");
      const diffInHours = now.diff(dateFormatted, "hour");
      const diffInDays = now.diff(dateFormatted, "day");
      const diffInWeeks = now.diff(dateFormatted, "week");
      const diffInMonths = now.diff(dateFormatted, "month");
      const diffInYears = now.diff(dateFormatted, "year");
      
      if (diffInSeconds < 60) return "a few seconds ago";
      if (diffInMinutes < 10) return "a few mins ago";
      if (diffInMinutes < 45) return `${diffInMinutes} mins ago`;
      if (diffInMinutes < 60) return "almost one hour ago";
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInDays < 7) return `${diffInDays} day${diffInDays===1?"":"s"} ago`;
      if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks===1?"":"s"} ago`;
      if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths===1?"":"s"} ago`;
      return `${diffInYears} year${diffInYears===1?"":"s"} ago`;
    
    default:
      return dateFormatted.format("DD/MM/YYYY");
  }
}
