import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GroupDetail from "./GroupDetail";
import type { Group, User } from "../../types";

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("GroupDetail", () => {
  const mockGroups: Group[] = [
    {
      id: "group1",
      name: "Cuca",
      userIds: ["user1", "user2"],
    },
    {
      id: "group2",
      name: "Family",
      userIds: ["user3"],
    },
  ];

  const mockUsers: User[] = [
    {
      id: "user1",
      name: "Alice",
      birthDate: new Date(1990, 0, 15),
      groupIds: ["group1"],
    },
    {
      id: "user2",
      name: "Bob",
      birthDate: new Date(1985, 0, 20),
      groupIds: ["group1"],
    },
    {
      id: "user3",
      name: "Charlie",
      birthDate: new Date(1992, 5, 10),
      groupIds: ["group2"],
    },
  ];

  const renderWithRouter = (groupId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/group/${groupId}`]}>
        <Routes>
          <Route
            path="/group/:groupId"
            element={<GroupDetail groups={mockGroups} users={mockUsers} />}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  describe("Group Display", () => {
    it("should render group name", () => {
      renderWithRouter("group1");
      expect(screen.getByText("Cuca")).toBeInTheDocument();
    });

    it("should display member count", () => {
      renderWithRouter("group1");
      expect(screen.getByText("2 members")).toBeInTheDocument();
    });

    it("should use singular 'member' for one member", () => {
      renderWithRouter("group2");
      expect(screen.getByText("1 member")).toBeInTheDocument();
    });

    it("should display back button", () => {
      renderWithRouter("group1");
      expect(screen.getByText("← Back to Groups")).toBeInTheDocument();
    });
  });

  describe("Members Display", () => {
    it("should display all members of the group", () => {
      renderWithRouter("group1");
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("should not display members from other groups", () => {
      renderWithRouter("group1");
      expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    });

    it("should display no members message for empty group", () => {
      const emptyGroups: Group[] = [
        {
          id: "group3",
          name: "Empty Group",
          userIds: [],
        },
      ];
      render(
        <MemoryRouter initialEntries={["/group/group3"]}>
          <Routes>
            <Route
              path="/group/:groupId"
              element={<GroupDetail groups={emptyGroups} users={[]} />}
            />
          </Routes>
        </MemoryRouter>,
      );
      expect(
        screen.getByText("No members in this group yet."),
      ).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display error for non-existent group", () => {
      renderWithRouter("nonexistent");
      expect(screen.getByText("Group not found")).toBeInTheDocument();
    });

    it("should display back button on error", () => {
      renderWithRouter("nonexistent");
      expect(screen.getByText("Back to Groups")).toBeInTheDocument();
    });
  });
});
