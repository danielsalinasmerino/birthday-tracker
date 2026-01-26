import type { User } from "../types";

/**
 * Calculate days until next birthday from today
 */
export function daysUntilBirthday(birthDate: string | Date): number {
  const today = new Date();
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  // Set this year's birthday
  const nextBirthday = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
  );

  // If birthday already passed this year, use next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  // Calculate difference in days
  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: string | Date): number {
  const today = new Date();
  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Sort users by upcoming birthday (closest first)
 */
export function sortByUpcomingBirthday(users: User[]): User[] {
  return [...users].sort((a, b) => {
    const daysA = daysUntilBirthday(a.birthDate);
    const daysB = daysUntilBirthday(b.birthDate);
    return daysA - daysB;
  });
}

/**
 * Format birthday date to readable string
 */
export function formatBirthday(birthDate: string | Date): string {
  const date = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
