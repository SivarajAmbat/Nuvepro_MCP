import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a more readable format
 * @param dateString Date string in ISO format
 * @param formatStr Format string for date-fns
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatStr: string = 'MMMM dd, yyyy'): string => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Check if a date is in the future
 * @param dateString Date string in ISO format
 * @param timeString Optional time string in HH:mm format
 * @returns Boolean indicating if the date is in the future
 */
export const isDateInFuture = (dateString: string, timeString?: string): boolean => {
  try {
    const date = timeString
      ? new Date(`${dateString}T${timeString}`)
      : parseISO(dateString);
    return date > new Date();
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
};

/**
 * Combine date and time into an ISO string
 * @param date Date string in YYYY-MM-DD format
 * @param time Time string in HH:mm format
 * @returns ISO formatted date-time string
 */
export const combineDateAndTime = (date: string, time: string): string => {
  try {
    return `${date}T${time}:00`;
  } catch (error) {
    console.error('Error combining date and time:', error);
    return new Date().toISOString();
  }
};
