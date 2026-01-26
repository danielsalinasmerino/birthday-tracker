import { calculateMonthsFromDays } from "./dateCalculations";

// Constants for text formatting
const BIRTHDAY_TEXT = {
  TODAY: "Today! 🎉",
  TOMORROW: "Tomorrow",
  IN_DAYS: (days: number) => `In ${days} days`,
  IN_ONE_MONTH: "In 1 month",
  IN_MONTHS: (months: number) => `In ${months} months`,
} as const;

const DAYS_THRESHOLD = 28;

/**
 * Format days until birthday into human-readable text.
 *
 * Returns different formats based on proximity:
 * - 0 days: "Today! 🎉"
 * - 1 day: "Tomorrow"
 * - 2-28 days: "In X days"
 * - 29+ days: "In X month(s)" (calculated using full calendar months)
 *
 * @param daysUntil - Number of days until the birthday
 * @returns A human-readable string describing when the birthday occurs
 *
 * @example
 * formatDaysUntilBirthday(0)  // "Today! 🎉"
 * formatDaysUntilBirthday(1)  // "Tomorrow"
 * formatDaysUntilBirthday(7)  // "In 7 days"
 * formatDaysUntilBirthday(60) // "In 2 months"
 */
export function formatDaysUntilBirthday(daysUntil: number): string {
  if (daysUntil === 0) return BIRTHDAY_TEXT.TODAY;
  if (daysUntil === 1) return BIRTHDAY_TEXT.TOMORROW;
  if (daysUntil <= DAYS_THRESHOLD) return BIRTHDAY_TEXT.IN_DAYS(daysUntil);

  // Format as months for birthdays more than 28 days away
  const months = calculateMonthsFromDays(daysUntil);
  if (months === 1) return BIRTHDAY_TEXT.IN_ONE_MONTH;
  return BIRTHDAY_TEXT.IN_MONTHS(months);
}
