import { Routes, Route } from "react-router-dom";
import "./App.css";
import UserGroups from "./components/UserGroups/UserGroups";
import GroupDetail from "./components/GroupDetail/GroupDetail";
import mockData from "./data/mockData.json";
import type { User, Group } from "./types";

function App() {
  // Parse dates from JSON strings
  const users: User[] = mockData.users.map((user) => ({
    ...user,
    birthDate: new Date(user.birthDate),
  }));

  const groups: Group[] = mockData.groups;

  // Example: Show groups for the first user (Daniel)
  const currentUserId = "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a";

  return (
    <Routes>
      <Route
        path="/"
        element={<UserGroups userId={currentUserId} groups={groups} />}
      />
      <Route
        path="/group/:groupId"
        element={<GroupDetail groups={groups} users={users} />}
      />
    </Routes>
  );
}

export default App;
