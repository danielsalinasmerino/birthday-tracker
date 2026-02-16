import { useNavigate } from "react-router-dom";
import type { Group } from "../../types";
import styles from "./UserGroups.module.css";

interface UserGroupsProps {
  userId: string;
  groups: Group[];
}

function UserGroups({ userId, groups }: UserGroupsProps) {
  const navigate = useNavigate();

  // Filter groups where the user belongs
  const userGroups = groups.filter((group) => group.userIds.includes(userId));

  const handleGroupClick = (groupId: string) => {
    navigate(`/group/${groupId}`);
  };

  if (userGroups.length === 0) {
    return (
      <div className={styles.userGroups}>
        <h2 className={styles.title}>Groups</h2>
        <p className={styles.noGroups}>You don't belong to any groups yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.userGroups}>
      <h2 className={styles.title}>Groups</h2>
      <div className={styles.groupsList}>
        {userGroups.map((group) => (
          <div
            key={group.id}
            className={styles.groupCard}
            onClick={() => handleGroupClick(group.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleGroupClick(group.id);
              }
            }}
          >
            <h3 className={styles.groupName}>{group.name}</h3>
            <p className={styles.memberCount}>
              {group.userIds.length}{" "}
              {group.userIds.length === 1 ? "member" : "members"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserGroups;
