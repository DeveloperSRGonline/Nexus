import {
  format,
  isToday,
  isTomorrow,
  isPast,
  formatDistanceToNow,
} from "date-fns";

export const formatDate = (date) => format(new Date(date), "MMM d, yyyy");
export const formatShort = (date) => format(new Date(date), "MMM d");
export const formatTime = (date) => format(new Date(date), "h:mm a");
export const isDateToday = (date) => isToday(new Date(date));
export const isDateTomorrow = (date) => isTomorrow(new Date(date));
export const isOverdue = (date) =>
  date && isPast(new Date(date)) && !isToday(new Date(date));
export const timeAgo = (date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const dueDateLabel = (date) => {
  if (!date) return null;
  if (isDateToday(date)) return "Today";
  if (isDateTomorrow(date)) return "Tomorrow";
  if (isOverdue(date)) return `Overdue · ${formatShort(date)}`;
  return formatShort(date);
};
