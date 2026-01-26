import "./App.css";
import BirthdayList from "./components/BirthdayList/BirthdayList";
import mockData from "./data/mockData.json";
import type { User, Group } from "./types";

function App() {
  // Parse dates from JSON strings
  const users: User[] = mockData.users.map((user) => ({
    ...user,
    birthDate: new Date(user.birthDate),
  }));

  const groups: Group[] = mockData.groups;

  // Get the Cuca group
  const cucaGroup = groups.find((group) => group.name === "Cuca");

  return <>{cucaGroup && <BirthdayList group={cucaGroup} users={users} />}</>;
}

export default App;
