import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PeopleList from "../PeopleList";
import type { Group, User } from "../../../types";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("PeopleList", () => {
  const mockGroups: Group[] = [
    { id: "group1", name: "Family", userIds: ["user1", "user2", "user3"] },
    { id: "group2", name: "Friends", userIds: ["user1", "user4"] },
  ];

  const mockUsers: User[] = [
    {
      id: "user1",
      name: "Daniel",
      surname: "Salinas",
      birthDate: new Date("1990-01-15"),
      groupIds: ["group1", "group2"],
    },
    {
      id: "user2",
      name: "John",
      surname: "Doe",
      birthDate: new Date("1985-03-20"),
      groupIds: ["group1"],
    },
    {
      id: "user3",
      name: "Jane",
      surname: "Smith",
      birthDate: new Date("1992-07-10"),
      groupIds: ["group1"],
    },
    {
      id: "user4",
      name: "Bob",
      surname: "Johnson",
      birthDate: new Date("1988-11-05"),
      groupIds: ["group2"],
    },
  ];

  const renderPeopleList = (userId: string) => {
    return render(
      <BrowserRouter>
        <PeopleList userId={userId} groups={mockGroups} users={mockUsers} />
      </BrowserRouter>,
    );
  };

  it("renders people from all user groups", () => {
    renderPeopleList("user1");

    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    expect(screen.getByText(/Bob Johnson/)).toBeInTheDocument();
  });

  it("does not show the current user in the list", () => {
    renderPeopleList("user1");

    expect(screen.queryByText(/Daniel Salinas/)).not.toBeInTheDocument();
  });

  it("displays group names for each person", () => {
    renderPeopleList("user1");

    expect(screen.getByText("Family")).toBeInTheDocument();
    expect(screen.getByText("Friends")).toBeInTheDocument();
  });

  it("shows message when no people found", () => {
    const emptyGroups: Group[] = [
      { id: "group1", name: "Empty Group", userIds: ["user1"] },
    ];

    render(
      <BrowserRouter>
        <PeopleList userId="user1" groups={emptyGroups} users={mockUsers} />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("No people found in your groups yet."),
    ).toBeInTheDocument();
  });

  it("navigates to group detail when person is clicked", () => {
    renderPeopleList("user1");

    const personCards = screen.getAllByRole("button");
    const johnCard = personCards.find((card) =>
      card.textContent?.includes("John Doe"),
    );
    johnCard?.click();

    expect(mockNavigate).toHaveBeenCalledWith("/group/group1");
  });

  it("deduplicates users appearing in multiple groups", () => {
    const overlappingGroups: Group[] = [
      { id: "group1", name: "Family", userIds: ["user1", "user2"] },
      { id: "group2", name: "Friends", userIds: ["user1", "user2"] },
    ];

    render(
      <BrowserRouter>
        <PeopleList
          userId="user1"
          groups={overlappingGroups}
          users={mockUsers}
        />
      </BrowserRouter>,
    );

    // John should appear only once
    const johnCards = screen.getAllByText(/John Doe/);
    expect(johnCards).toHaveLength(1);

    // But should show both groups
    expect(screen.getByText("Family, Friends")).toBeInTheDocument();
  });
});
