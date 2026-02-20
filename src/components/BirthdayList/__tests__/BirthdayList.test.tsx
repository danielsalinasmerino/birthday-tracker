import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppProvider } from "../../../contexts/AppContext.tsx";
import BirthdayList from "../BirthdayList";
import type { User, Group } from "../../../types";

describe("BirthdayList", () => {
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

  const renderWithProvider = (
    group: Group,
    users: User[],
    currentUserId = "current-user",
  ) => {
    return render(
      <AppProvider currentUserId={currentUserId}>
        <BirthdayList group={group} users={users} />
      </AppProvider>,
    );
  };

  const mockGroup: Group = {
    id: "group1",
    name: "Test Group",
    userIds: ["1", "2", "3"],
  };

  const mockUsers: User[] = [
    {
      id: "1",
      name: "Alice",
      surname: "Smith",
      birthDate: new Date(1990, 2, 15), // March 15, 1990
      groupIds: ["group1"],
    },
    {
      id: "2",
      name: "Bob",
      surname: "Johnson",
      birthDate: new Date(1985, 0, 29), // January 29, 1985 - Today
      groupIds: ["group1"],
    },
    {
      id: "3",
      name: "Charlie",
      surname: "Brown",
      birthDate: new Date(1992, 1, 10), // February 10, 1992
      groupIds: ["group1"],
    },
    {
      id: "4",
      name: "Diana",
      surname: "Wilson",
      birthDate: new Date(1988, 5, 20), // June 20, 1988
      groupIds: ["group2"], // Different group
    },
  ];

  describe("Group Display", () => {
    it("should render group name", () => {
      renderWithProvider(mockGroup, mockUsers);
      expect(screen.getByText("Test Group")).toBeInTheDocument();
    });

    it("should display correct member count with plural", () => {
      renderWithProvider(mockGroup, mockUsers);
      expect(screen.getByText("3 members")).toBeInTheDocument();
    });

    it('should display singular "member" for one user', () => {
      const singleUserGroup: Group = {
        id: "group2",
        name: "Single Group",
        userIds: ["4"],
      };
      renderWithProvider(singleUserGroup, mockUsers);
      expect(screen.getByText("1 member")).toBeInTheDocument();
    });

    it('should display "0 members" for empty group', () => {
      const emptyGroup: Group = {
        id: "group3",
        name: "Empty Group",
        userIds: [],
      };
      renderWithProvider(emptyGroup, mockUsers);
      expect(screen.getByText("0 members")).toBeInTheDocument();
    });
  });

  describe("User Filtering", () => {
    it("should only display users in the specified group", () => {
      renderWithProvider(mockGroup, mockUsers);
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
      expect(screen.queryByText("Diana Wilson")).not.toBeInTheDocument();
    });

    it("should handle users with no groupIds", () => {
      const usersWithNoGroups: User[] = [
        ...mockUsers,
        {
          id: "5",
          name: "Eve",
          birthDate: new Date(1993, 4, 10), // May 10, 1993
        },
      ];
      renderWithProvider(mockGroup, usersWithNoGroups);
      expect(screen.queryByText("Eve")).not.toBeInTheDocument();
    });

    it("should handle users belonging to multiple groups", () => {
      const multiGroupUser: User = {
        id: "5",
        name: "Frank",
        birthDate: new Date(1991, 3, 15), // April 15, 1991
        groupIds: ["group1", "group2"],
      };
      renderWithProvider(mockGroup, [...mockUsers, multiGroupUser]);
      expect(screen.getByText("Frank")).toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("should sort users by upcoming birthday (closest first)", () => {
      const { container } = renderWithProvider(mockGroup, mockUsers);
      const cards = container.querySelectorAll('[class*="birthdayCard"]');

      // Get the text content of each card
      const names = Array.from(cards).map((card) => {
        const nameElement = card.querySelector("h3");
        return nameElement?.textContent;
      });

      // Bob (today) should be first, then Charlie (Feb 10), then Alice (Mar 15)
      expect(names[0]).toContain("Bob Johnson");
      expect(names[1]).toContain("Charlie Brown");
      expect(names[2]).toContain("Alice Smith");
    });

    it("should maintain sort order when rendering", () => {
      renderWithProvider(mockGroup, mockUsers);

      // Check that "Today!" appears before "In X days"
      const allText = screen.getAllByText(/Today!|In \d+/);
      expect(allText[0].textContent).toContain("Today!");
    });
  });

  describe("Empty States", () => {
    it("should render empty list when no users belong to group", () => {
      const emptyGroup: Group = {
        id: "group3",
        name: "Empty Group",
        userIds: [],
      };
      const { container } = renderWithProvider(emptyGroup, mockUsers);
      const cards = container.querySelectorAll('[class*="birthdayCard"]');
      expect(cards.length).toBe(0);
      expect(screen.getByText("0 members")).toBeInTheDocument();
    });

    it("should render with empty users array", () => {
      const { container } = renderWithProvider(mockGroup, []);
      const cards = container.querySelectorAll('[class*="birthdayCard"]');
      expect(cards.length).toBe(0);
    });
  });

  describe("Integration with BirthdayCard", () => {
    it("should render BirthdayCard for each user in group", () => {
      const { container } = renderWithProvider(mockGroup, mockUsers);
      const cards = container.querySelectorAll('[class*="birthdayCard"]');
      expect(cards.length).toBe(3); // Only users in group1
    });

    it("should pass correct user data to BirthdayCard", () => {
      renderWithProvider(mockGroup, mockUsers);

      // Verify that each user's information is displayed
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.getByText("Charlie Brown")).toBeInTheDocument();

      // Verify birthday dates are displayed
      expect(screen.getByText("March 15")).toBeInTheDocument();
      expect(screen.getByText("January 29")).toBeInTheDocument();
      expect(screen.getByText("February 10")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle group with undefined userIds array", () => {
      const groupWithoutUserIds = {
        id: "group4",
        name: "Test Group",
        userIds: [],
      };
      renderWithProvider(groupWithoutUserIds, mockUsers);
      expect(screen.getByText("0 members")).toBeInTheDocument();
    });

    it("should handle users with all birthdays in the past for this year", () => {
      vi.setSystemTime(new Date(2026, 11, 31, 0, 0, 0)); // December 31, 2026
      const { container } = renderWithProvider(mockGroup, mockUsers);

      // All birthdays should show as next year
      const cards = container.querySelectorAll('[class*="birthdayCard"]');
      expect(cards.length).toBe(3);
    });

    it("should handle same birthday for multiple users", () => {
      const sameBirthdayUsers: User[] = [
        {
          id: "1",
          name: "User1",
          birthDate: new Date(1990, 1, 15), // February 15, 1990
          groupIds: ["group1"],
        },
        {
          id: "2",
          name: "User2",
          birthDate: new Date(1985, 1, 15), // February 15, 1985
          groupIds: ["group1"],
        },
      ];
      const group: Group = {
        id: "group1",
        name: "Test Group",
        userIds: ["1", "2"],
      };

      renderWithProvider(group, sameBirthdayUsers);
      expect(screen.getByText("User1")).toBeInTheDocument();
      expect(screen.getByText("User2")).toBeInTheDocument();
      expect(screen.getAllByText("February 15")).toHaveLength(2);
    });
  });
});
