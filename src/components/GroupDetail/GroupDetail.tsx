import { useParams, useNavigate } from "react-router-dom";
import type { Group, User } from "../../types";
import BirthdayCard from "../BirthdayCard/BirthdayCard";
import { sortByUpcomingBirthday } from "../../utils/dateUtils";
import styles from "./GroupDetail.module.css";

interface GroupDetailProps {
  groups: Group[];
  users: User[];
}

function GroupDetail({ groups, users }: GroupDetailProps) {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <div className={styles.groupDetail}>
        <div className={styles.error}>
          <h2>Group not found</h2>
          <button onClick={() => navigate("/")} className={styles.backButton}>
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  // Filter users that belong to this group
  const groupUsers = users.filter((user) => user.groupIds?.includes(group.id));

  // Sort by upcoming birthday
  const sortedUsers = sortByUpcomingBirthday(groupUsers);

  const memberText = sortedUsers.length === 1 ? "member" : "members";

  return (
    <div className={styles.groupDetail}>
      <div className={styles.header}>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          ← Back to Groups
        </button>
        <h1 className={styles.groupName}>{group.name}</h1>
        <p className={styles.userCount}>
          {sortedUsers.length} {memberText}
        </p>
      </div>
      <div className={styles.list}>
        {sortedUsers.length === 0 ? (
          <p className={styles.noMembers}>No members in this group yet.</p>
        ) : (
          sortedUsers.map((user) => <BirthdayCard key={user.id} user={user} />)
        )}
      </div>
    </div>
  );
}

export default GroupDetail;
