/**
 * Calculate the number of full calendar months between today and a future date.
 *
 * This function counts complete month boundaries crossed, accounting for
 * different month lengths and year boundaries.
 *
 * @param daysUntil - Number of days from today to the target date
 * @returns The number of full months between today and the target date
 *
 * @example
 * // January 26 to April 20 (84 days) returns 2 or 3 depending on month lengths
 * calculateMonthsFromDays(84)
 */
export function calculateMonthsFromDays(daysUntil: number): number {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntil);

  let months = 0;
  const tempDate = new Date(today);

  // Count full months until we're within the target month
  while (
    tempDate.getFullYear() < targetDate.getFullYear() ||
    (tempDate.getFullYear() === targetDate.getFullYear() &&
      tempDate.getMonth() < targetDate.getMonth())
  ) {
    months++;
    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  return months;
}
