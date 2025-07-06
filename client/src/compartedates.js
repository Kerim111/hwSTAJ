/**
 * Compares two PostgreSQL timestamp strings
 * @param {string} timestamp1 - PostgreSQL timestamp from updated_at
 * @param {string} timestamp2 - PostgreSQL timestamp from updated_at
 * @returns {number} Positive if timestamp1 is later, negative if timestamp2 is later, 0 if equal
 */
function compareDates(timestamp1, timestamp2) {
  // PostgreSQL timestamps can be directly parsed by Date constructor
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  // Return the time difference in milliseconds
  return date1.getTime() - date2.getTime();
}

// Export the function
export default compareDates;

