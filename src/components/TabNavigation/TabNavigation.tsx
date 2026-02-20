import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TabNavigation.module.css";

function TabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isGroupsActive = location.pathname === "/";
  const isPeopleActive = location.pathname === "/people";

  return (
    <nav className={styles.tabNavigation}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${isGroupsActive ? styles.active : ""}`}
          onClick={() => navigate("/")}
        >
          Groups
        </button>
        <button
          className={`${styles.tab} ${isPeopleActive ? styles.active : ""}`}
          onClick={() => navigate("/people")}
        >
          People
        </button>
      </div>
    </nav>
  );
}

export default TabNavigation;
