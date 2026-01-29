import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BirthdayCard from "../BirthdayCard";
import type { User } from "../../../types";

describe("BirthdayCard", () => {
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

  const createMockUser = (overrides?: Partial<User>): User => ({
    id: "1",
    name: "John",
    surname: "Doe",
    birthDate: new Date("1990-02-15"),
    groupIds: ["group1"],
    showAge: false,
    ...overrides,
  });

  describe("User Display", () => {
    it("should render user name and surname", () => {
      const user = createMockUser();
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should render user name without surname when surname is not provided", () => {
      const user = createMockUser({ surname: undefined });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("should display age when showAge is true", () => {
      const user = createMockUser({
        birthDate: new Date("1990-02-15"),
        showAge: true,
      });
      render(<BirthdayCard user={user} />);
      // Age will be 36 on next birthday (Feb 15, 2026)
      expect(screen.getByText(/John Doe \(36\)/)).toBeInTheDocument();
    });

    it("should not display age when showAge is false", () => {
      const user = createMockUser({ showAge: false });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
    });
  });

  describe("Birthday Information", () => {
    it("should display formatted birthday date", () => {
      const user = createMockUser({ birthDate: new Date("1990-02-15") });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("February 15")).toBeInTheDocument();
    });

    it('should display "Today! 🎉" for birthday today', () => {
      const user = createMockUser({
        birthDate: new Date(1990, 0, 29), // January 29, 1990 in local time
      });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("Today! 🎉")).toBeInTheDocument();
    });

    it('should display "Tomorrow" for birthday tomorrow', () => {
      const user = createMockUser({
        birthDate: new Date(1990, 0, 30), // January 30, 1990 in local time
      });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    });

    it('should display "In X days" for upcoming birthdays', () => {
      const user = createMockUser({
        birthDate: new Date(1990, 1, 5), // February 5, 1990 in local time
      });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("In 7 days")).toBeInTheDocument();
    });

    it("should display month format for distant birthdays", () => {
      const user = createMockUser({ birthDate: new Date("1990-06-15") });
      render(<BirthdayCard user={user} />);
      const daysText = screen.getByText(/In \d+ months?/);
      expect(daysText).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it('should apply "today" class for birthday today', () => {
      const user = createMockUser({
        birthDate: new Date(1990, 0, 29), // January 29, 1990 in local time
      });
      render(<BirthdayCard user={user} />);
      const daysElement = screen.getByText("Today! 🎉");
      expect(daysElement.className).toContain("today");
    });

    it('should apply "soon" class for birthdays within 7 days', () => {
      const user = createMockUser({
        birthDate: new Date(1990, 1, 5), // February 5, 1990 in local time
      });
      render(<BirthdayCard user={user} />);
      const daysElement = screen.getByText("In 7 days");
      expect(daysElement.className).toContain("soon");
    });

    it("should not apply special class for distant birthdays", () => {
      const user = createMockUser({ birthDate: new Date("1990-06-15") });
      const { container } = render(<BirthdayCard user={user} />);
      const daysElement = container.querySelector('[class*="daysUntil"]');
      expect(daysElement?.className).not.toContain("today");
      expect(daysElement?.className).not.toContain("soon");
    });
  });

  describe("Edge Cases", () => {
    it("should handle leap year birthdays", () => {
      const user = createMockUser({ birthDate: new Date("2000-02-29") });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("February 29")).toBeInTheDocument();
    });

    it("should handle year boundary", () => {
      vi.setSystemTime(new Date("2026-12-31T12:00:00.000Z"));
      const user = createMockUser({
        birthDate: new Date(1990, 0, 1), // January 1, 1990 in local time
      });
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    });

    it("should render with missing optional fields", () => {
      const user: User = {
        id: "1",
        name: "Jane",
        birthDate: new Date("1995-03-20"),
      };
      render(<BirthdayCard user={user} />);
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("March 20")).toBeInTheDocument();
    });
  });
});
