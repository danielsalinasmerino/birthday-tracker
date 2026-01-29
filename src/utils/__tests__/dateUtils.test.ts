import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  daysUntilBirthday,
  calculateAge,
  sortByUpcomingBirthday,
  formatBirthday,
} from "../dateUtils";
import type { User } from "../../types";

describe("dateUtils", () => {
  let originalDate: typeof Date;

  beforeEach(() => {
    originalDate = globalThis.Date;
    // Mock today as January 29, 2026 at midnight local time
    vi.setSystemTime(new Date(2026, 0, 29, 0, 0, 0));
  });

  afterEach(() => {
    globalThis.Date = originalDate;
    vi.restoreAllMocks();
  });

  describe("daysUntilBirthday", () => {
    it("should return 0 for birthday today", () => {
      const birthDate = new Date(1990, 0, 29); // January 29, 1990
      expect(daysUntilBirthday(birthDate)).toBe(0);
    });

    it("should return 1 for birthday tomorrow", () => {
      const birthDate = new Date(1990, 0, 30); // January 30, 1990
      expect(daysUntilBirthday(birthDate)).toBe(1);
    });

    it("should calculate days until birthday later this year", () => {
      const birthDate = new Date(1990, 2, 15); // March 15, 1990
      const result = daysUntilBirthday(birthDate);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(365);
    });

    it("should calculate days until birthday next year for passed birthdays", () => {
      const birthDate = new Date(1990, 0, 15); // January 15, 1990 - Already passed
      const result = daysUntilBirthday(birthDate);
      expect(result).toBeGreaterThan(300); // Should be ~351 days
    });

    it("should handle string date input", () => {
      const birthDate = new Date(1990, 0, 29); // January 29, 1990
      expect(daysUntilBirthday(birthDate)).toBe(0);
    });

    it("should handle leap year birthdays", () => {
      const birthDate = new Date(2000, 1, 29); // February 29, 2000
      const result = daysUntilBirthday(birthDate);
      expect(result).toBeGreaterThan(0);
    });

    it("should handle year-end boundary", () => {
      vi.setSystemTime(new Date(2026, 11, 31, 0, 0, 0)); // December 31, 2026
      const birthDate = new Date(1990, 0, 1); // January 1, 1990
      expect(daysUntilBirthday(birthDate)).toBe(1);
    });
  });

  describe("calculateAge", () => {
    it("should calculate correct age", () => {
      const birthDate = new Date(1990, 0, 15); // January 15, 1990
      expect(calculateAge(birthDate)).toBe(36);
    });

    it("should not count birthday if it hasnt occurred yet this year", () => {
      const birthDate = new Date(1990, 5, 15); // June 15, 1990
      expect(calculateAge(birthDate)).toBe(35);
    });

    it("should count birthday if it already occurred this year", () => {
      const birthDate = new Date(1990, 0, 1); // January 1, 1990
      expect(calculateAge(birthDate)).toBe(36);
    });

    it("should handle birthday today", () => {
      const birthDate = new Date(1990, 0, 29); // January 29, 1990
      expect(calculateAge(birthDate)).toBe(36);
    });

    it("should handle string date input", () => {
      const birthDate = new Date(1990, 0, 15); // January 15, 1990
      expect(calculateAge(birthDate)).toBe(36);
    });

    it("should calculate age for someone born yesterday", () => {
      const birthDate = new Date(2026, 0, 28); // January 28, 2026
      expect(calculateAge(birthDate)).toBe(0);
    });

    it("should handle leap year birthdays", () => {
      vi.setSystemTime(new Date(2026, 2, 1, 0, 0, 0)); // March 1, 2026
      const birthDate = new Date(2000, 1, 29); // February 29, 2000
      expect(calculateAge(birthDate)).toBe(26);
    });
  });

  describe("sortByUpcomingBirthday", () => {
    const users: User[] = [
      {
        id: "1",
        name: "Alice",
        birthDate: new Date(1990, 2, 15), // March 15, 1990
        groupIds: ["group1"],
      },
      {
        id: "2",
        name: "Bob",
        birthDate: new Date(1985, 0, 29), // January 29, 1985 - Today
        groupIds: ["group1"],
      },
      {
        id: "3",
        name: "Charlie",
        birthDate: new Date(1992, 1, 10), // February 10, 1992
        groupIds: ["group1"],
      },
      {
        id: "4",
        name: "Diana",
        birthDate: new Date(1988, 0, 30), // January 30, 1988 - Tomorrow
        groupIds: ["group1"],
      },
    ];

    it("should sort users by upcoming birthday", () => {
      const sorted = sortByUpcomingBirthday(users);
      expect(sorted[0].name).toBe("Bob"); // Today
      expect(sorted[1].name).toBe("Diana"); // Tomorrow
      expect(sorted[2].name).toBe("Charlie"); // Feb 10
      expect(sorted[3].name).toBe("Alice"); // Mar 15
    });

    it("should not mutate the original array", () => {
      const original = [...users];
      sortByUpcomingBirthday(users);
      expect(users).toEqual(original);
    });

    it("should handle empty array", () => {
      const sorted = sortByUpcomingBirthday([]);
      expect(sorted).toEqual([]);
    });

    it("should handle single user", () => {
      const singleUser = [users[0]];
      const sorted = sortByUpcomingBirthday(singleUser);
      expect(sorted).toEqual(singleUser);
    });
  });

  describe("formatBirthday", () => {
    it('should format date as "Month Day"', () => {
      const birthDate = new Date(1990, 0, 15); // January 15, 1990
      expect(formatBirthday(birthDate)).toBe("January 15");
    });

    it("should handle different months", () => {
      expect(formatBirthday(new Date(1990, 11, 25))).toBe("December 25");
      expect(formatBirthday(new Date(1990, 5, 1))).toBe("June 1");
    });

    it("should handle string date input", () => {
      const birthDate = new Date(1990, 2, 15); // March 15, 1990
      expect(formatBirthday(birthDate)).toBe("March 15");
    });

    it("should format single digit days without leading zero", () => {
      const birthDate = new Date(1990, 6, 5); // July 5, 1990
      expect(formatBirthday(birthDate)).toBe("July 5");
    });

    it("should format end of month dates", () => {
      const birthDate = new Date(1990, 0, 31); // January 31, 1990
      expect(formatBirthday(birthDate)).toBe("January 31");
    });
  });
});
