import type { User } from "../../types";
import { useApp } from "../../hooks/useApp";
import {
  daysUntilBirthday,
  formatBirthday,
  calculateAge,
} from "../../utils/dateUtils";
import { formatDaysUntilBirthday } from "./utils/formatters";
import styles from "./BirthdayCard.module.css";

interface BirthdayCardProps {
  user: User;
}

function BirthdayCard({ user }: BirthdayCardProps) {
  const { currentUserId } = useApp();
  const daysUntil = daysUntilBirthday(user.birthDate);
  const birthday = formatBirthday(user.birthDate);
  const nextAge = calculateAge(user.birthDate) + 1;

  const getDaysClass = () => {
    if (daysUntil === 0) return `${styles.daysUntil} ${styles.today}`;
    if (daysUntil <= 7) return `${styles.daysUntil} ${styles.soon}`;
    return styles.daysUntil;
  };

  const isCurrentUser = currentUserId === user.id;
  const fullName = user.surname ? `${user.name} ${user.surname}` : user.name;
  const displayNameBase = isCurrentUser ? "Me" : fullName;
  const displayName = user.showAge
    ? `${displayNameBase} (${nextAge})`
    : displayNameBase;

  return (
    <div className={styles.birthdayCard}>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>{displayName}</h3>
      </div>
      <div className={styles.birthdayInfo}>
        <p className={styles.birthdayDate}>{birthday}</p>
        <p className={getDaysClass()}>{formatDaysUntilBirthday(daysUntil)}</p>
      </div>
    </div>
  );
}

export default BirthdayCard;
