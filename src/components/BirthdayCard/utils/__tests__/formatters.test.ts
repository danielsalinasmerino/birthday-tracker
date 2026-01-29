import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDaysUntilBirthday } from "../formatters";

describe("formatters", () => {
  describe("formatDaysUntilBirthday", () => {
    let originalDate: typeof Date;

    beforeEach(() => {
      originalDate = globalThis.Date;
    });

    afterEach(() => {
      globalThis.Date = originalDate;
      vi.restoreAllMocks();
    });

    it('should return "Today! 🎉" for 0 days', () => {
      expect(formatDaysUntilBirthday(0)).toBe("Today! 🎉");
    });

    it('should return "Tomorrow" for 1 day', () => {
      expect(formatDaysUntilBirthday(1)).toBe("Tomorrow");
    });

    it('should return "In X days" for 2-28 days', () => {
      expect(formatDaysUntilBirthday(2)).toBe("In 2 days");
      expect(formatDaysUntilBirthday(7)).toBe("In 7 days");
      expect(formatDaysUntilBirthday(14)).toBe("In 14 days");
      expect(formatDaysUntilBirthday(28)).toBe("In 28 days");
    });

    it('should return "In 1 month" for dates resulting in 1 month', () => {
      // Mock today as January 15, 2026
      const mockDate = new Date("2026-01-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 30 days should be approximately 1 month away
      expect(formatDaysUntilBirthday(30)).toBe("In 1 month");
    });

    it('should return "In X months" for dates more than 28 days away', () => {
      // Mock today as January 15, 2026
      const mockDate = new Date("2026-01-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 60 days should be approximately 2 months away
      const result = formatDaysUntilBirthday(60);
      expect(result).toMatch(/In \d+ months?/);
    });

    it("should handle edge case at 29 days threshold", () => {
      // Mock today as January 15, 2026
      const mockDate = new Date("2026-01-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      const result = formatDaysUntilBirthday(29);
      // Should switch to month format
      expect(result).toMatch(/In \d+ months?/);
    });

    it("should handle large day counts", () => {
      // Mock today as January 1, 2026
      const mockDate = new Date("2026-01-01T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      const result = formatDaysUntilBirthday(365);
      expect(result).toMatch(/In \d+ months/);
      // Should be around 12 months
      expect(result).toContain("months");
    });
  });
});
