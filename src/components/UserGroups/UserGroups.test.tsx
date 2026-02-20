import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserGroups from "./UserGroups";
import type { Group } from "../../types";

describe("UserGroups", () => {
  const mockGroups: Group[] = [
    {
      id: "group1",
      name: "Cuca",
      userIds: ["user1", "user2", "user3"],
    },
    {
      id: "group2",
      name: "Family",
      userIds: ["user1", "user4"],
    },
    {
      id: "group3",
      name: "Work",
      userIds: ["user2", "user3"],
    },
  ];

  const renderWithRouter = (userId: string, groups: Group[]) => {
    return render(
      <BrowserRouter>
        <UserGroups userId={userId} groups={groups} />
      </BrowserRouter>,
    );
  };

  describe("Group Display", () => {
    it("should render title", () => {
      renderWithRouter("user1", mockGroups);
      expect(screen.getByText("Groups")).toBeInTheDocument();
    });

    it("should display all groups where user belongs", () => {
      renderWithRouter("user1", mockGroups);
      expect(screen.getByText("Cuca")).toBeInTheDocument();
      expect(screen.getByText("Family")).toBeInTheDocument();
      expect(screen.queryByText("Work")).not.toBeInTheDocument();
    });

    it("should display member count for each group", () => {
      renderWithRouter("user1", mockGroups);
      expect(screen.getByText("3 members")).toBeInTheDocument();
      expect(screen.getByText("2 members")).toBeInTheDocument();
    });

    it("should use singular 'member' for groups with one member", () => {
      const singleMemberGroups: Group[] = [
        {
          id: "group1",
          name: "Solo Group",
          userIds: ["user1"],
        },
      ];
      renderWithRouter("user1", singleMemberGroups);
      expect(screen.getByText("1 member")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should display message when user belongs to no groups", () => {
      renderWithRouter("user999", mockGroups);
      expect(
        screen.getByText("You don't belong to any groups yet."),
      ).toBeInTheDocument();
    });

    it("should not display any group cards when user belongs to no groups", () => {
      const { container } = renderWithRouter("user999", mockGroups);
      const groupCards = container.querySelectorAll('[class*="groupCard"]');
      expect(groupCards.length).toBe(0);
    });

    it("should display message when groups array is empty", () => {
      renderWithRouter("user1", []);
      expect(
        screen.getByText("You don't belong to any groups yet."),
      ).toBeInTheDocument();
    });
  });

  describe("Multiple Groups", () => {
    it("should display correct count of groups", () => {
      const { container } = renderWithRouter("user1", mockGroups);
      const groupCards = container.querySelectorAll('[class*="groupCard"]');
      expect(groupCards.length).toBe(2); // user1 belongs to 2 groups
    });

    it("should filter groups correctly for different users", () => {
      renderWithRouter("user2", mockGroups);
      expect(screen.getByText("Cuca")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.queryByText("Family")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle user not in any groups", () => {
      renderWithRouter("nonexistent", mockGroups);
      expect(screen.getByText("Groups")).toBeInTheDocument();
      expect(
        screen.getByText("You don't belong to any groups yet."),
      ).toBeInTheDocument();
    });

    it("should handle empty userIds in group", () => {
      const emptyGroups: Group[] = [
        {
          id: "group1",
          name: "Empty Group",
          userIds: [],
        },
      ];
      renderWithRouter("user1", emptyGroups);
      expect(
        screen.getByText("You don't belong to any groups yet."),
      ).toBeInTheDocument();
    });
  });
});
