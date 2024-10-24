/**
 * Formats a given date object into a string representation of date and time in the format 'YYYY-MM-DD HH:mm:ss'.
 * @param date - The date object to format.
 * @returns A string representation of the date and time in the format 'YYYY-MM-DD HH:mm:ss'.
 */
export function formatDateTime(date: Date) {
  const isoString = date.toISOString();
  return isoString.slice(0, 19).replace('T', ' ');
}

/**
 * Formats a given date object into a string representation of date and time in the format 'YYYY-MM-DD'.
 * @param date - The date object to format.
 * @returns A string representation of the date and time in the format 'YYYY-MM-DD'.
 */
export function formatDate(date: Date) {
  const isoString = date.toISOString();
  return isoString.slice(0, 10);
}
