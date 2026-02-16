import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import { AppProvider } from "./contexts/AppContext.tsx";
import UserGroups from "./components/UserGroups/UserGroups";
import GroupDetail from "./components/GroupDetail/GroupDetail";
import { getUsers, getGroups } from "./domain/usecases";
import {
  userRepository,
  groupRepository,
} from "./infrastructure/instances/repositories";
import type { User, Group } from "./domain/models";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUsers, fetchedGroups] = await Promise.all([
          getUsers(userRepository),
          getGroups(groupRepository),
        ]);
        setUsers(fetchedUsers);
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Example: Show groups for the first user (Daniel)
  const currentUserId = "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a";

  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  return (
    <AppProvider currentUserId={currentUserId}>
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
    </AppProvider>
  );
}

export default App;
