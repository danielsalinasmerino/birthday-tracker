import { useNavigate } from "react-router-dom";
import type { Group, User } from "../../types";
import { sortByUpcomingBirthday } from "../../utils/dateUtils";
import BirthdayCard from "../BirthdayCard/BirthdayCard";
import styles from "./PeopleList.module.css";

interface PeopleListProps {
  userId: string;
  groups: Group[];
  users: User[];
}

interface PersonWithGroups extends User {
  groupNames: string;
  groupIds: string[];
}

function PeopleList({ userId, groups, users }: PeopleListProps) {
  const navigate = useNavigate();

  // Get groups the user belongs to
  const userGroups = groups.filter((group) => group.userIds.includes(userId));

  // Get all people from those groups (excluding the current user) and deduplicate
  const peopleMap = new Map<string, PersonWithGroups>();

  userGroups.forEach((group) => {
    const groupUsers = users.filter(
      (user) => user.groupIds?.includes(group.id) && user.id !== userId,
    );

    groupUsers.forEach((user) => {
      if (peopleMap.has(user.id)) {
        // User already exists, add this group to their groups
        const existingPerson = peopleMap.get(user.id)!;
        existingPerson.groupNames += `, ${group.name}`;
        existingPerson.groupIds.push(group.id);
      } else {
        // New user, add them to the map
        peopleMap.set(user.id, {
          ...user,
          groupNames: group.name,
          groupIds: [group.id],
        } as PersonWithGroups);
      }
    });
  });

  // Convert map to array and sort by upcoming birthday
  const peopleArray = Array.from(peopleMap.values());
  const sortedPeople = sortByUpcomingBirthday(
    peopleArray,
  ) as PersonWithGroups[];

  const handlePersonClick = (groupIds: string[]) => {
    // Navigate to the first group
    navigate(`/group/${groupIds[0]}`);
  };

  if (sortedPeople.length === 0) {
    return (
      <div className={styles.peopleList}>
        <h2 className={styles.title}>People</h2>
        <p className={styles.noPeople}>No people found in your groups yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.peopleList}>
      <h2 className={styles.title}>People</h2>
      <div className={styles.list}>
        {sortedPeople.map((person) => (
          <BirthdayCard
            key={person.id}
            user={person}
            groupName={person.groupNames}
            onClick={() => handlePersonClick(person.groupIds)}
          />
        ))}
      </div>
    </div>
  );
}

export default PeopleList;
