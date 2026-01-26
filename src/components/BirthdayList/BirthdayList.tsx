import type { User, Group } from "../../types";
import { sortByUpcomingBirthday } from "../../utils/dateUtils";
import BirthdayCard from "../BirthdayCard/BirthdayCard";
import styles from "./BirthdayList.module.css";

interface BirthdayListProps {
  group: Group;
  users: User[];
}

function BirthdayList({ group, users }: BirthdayListProps) {
  // Filter users that belong to this group
  const groupUsers = users.filter((user) => user.groupIds?.includes(group.id));

  // Sort by upcoming birthday
  const sortedUsers = sortByUpcomingBirthday(groupUsers);

  return (
    <div className={styles.birthdayList}>
      <div className={styles.header}>
        <h1 className={styles.groupName}>{group.name}</h1>
        <p className={styles.userCount}>
          {sortedUsers.length} {sortedUsers.length === 1 ? "member" : "members"}
        </p>
      </div>
      <div className={styles.list}>
        {sortedUsers.map((user) => (
          <BirthdayCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default BirthdayList;
