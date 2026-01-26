import type { User, Group } from "../../types";
import { sortByUpcomingBirthday } from "../../utils/dateUtils";
import BirthdayCard from "../BirthdayCard/BirthdayCard";
import styles from "./BirthdayList.module.css";

const MEMBER_TEXT = {
  SINGULAR: "member",
  PLURAL: "members",
} as const;

interface BirthdayListProps {
  group: Group;
  users: User[];
}

function BirthdayList({ group, users }: BirthdayListProps) {
  // Filter users that belong to this group
  const groupUsers = users.filter((user) => user.groupIds?.includes(group.id));

  // Sort by upcoming birthday
  const sortedUsers = sortByUpcomingBirthday(groupUsers);

  const memberText =
    sortedUsers.length === 1 ? MEMBER_TEXT.SINGULAR : MEMBER_TEXT.PLURAL;

  return (
    <div className={styles.birthdayList}>
      <div className={styles.header}>
        <h1 className={styles.groupName}>{group.name}</h1>
        <p className={styles.userCount}>
          {sortedUsers.length} {memberText}
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
