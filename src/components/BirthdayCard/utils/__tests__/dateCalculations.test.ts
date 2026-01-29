import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { calculateMonthsFromDays } from "../dateCalculations";

describe("dateCalculations", () => {
  describe("calculateMonthsFromDays", () => {
    let originalDate: typeof Date;

    beforeEach(() => {
      originalDate = globalThis.Date;
    });

    afterEach(() => {
      globalThis.Date = originalDate;
      vi.restoreAllMocks();
    });

    it("should return 0 months for dates within the current month", () => {
      // Mock today as January 15, 2026
      const mockDate = new Date("2026-01-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 10 days away (still in January)
      expect(calculateMonthsFromDays(10)).toBe(0);
    });

    it("should return 1 month for dates in the next month", () => {
      // Mock today as January 15, 2026
      const mockDate = new Date("2026-01-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 30 days away (mid-February)
      expect(calculateMonthsFromDays(30)).toBe(1);
    });

    it("should return 2 months for dates two months away", () => {
      // Mock today as January 15, 2026
      const mockDate = new Date("2026-01-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 60 days away (mid-March)
      expect(calculateMonthsFromDays(60)).toBe(2);
    });

    it("should handle year boundaries correctly", () => {
      // Mock today as November 15, 2025
      const mockDate = new Date("2025-11-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 60 days away (crosses into 2026)
      expect(calculateMonthsFromDays(60)).toBe(2);
    });

    it("should return 0 for 0 days", () => {
      const mockDate = new Date("2026-01-15T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      expect(calculateMonthsFromDays(0)).toBe(0);
    });

    it("should handle end-of-month edge cases", () => {
      // Mock today as January 31, 2026
      const mockDate = new Date("2026-01-31T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 28 days away (February 28, 2026) - crosses into next month
      expect(calculateMonthsFromDays(28)).toBe(1);

      // 29 days away (March 1, 2026) - crosses into March
      expect(calculateMonthsFromDays(29)).toBe(1);

      // 60 days away (April 1, 2026) - crosses into April
      expect(calculateMonthsFromDays(60)).toBe(2);
    });

    it("should handle large day counts", () => {
      // Mock today as January 1, 2026
      const mockDate = new Date("2026-01-01T00:00:00.000Z");
      vi.setSystemTime(mockDate);

      // 365 days away (approximately 12 months)
      const result = calculateMonthsFromDays(365);
      expect(result).toBeGreaterThanOrEqual(11);
      expect(result).toBeLessThanOrEqual(12);
    });
  });
});
