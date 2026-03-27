import useUIStore from "@/store/uiStore";
import { STATUS_LABELS } from "@/constants/taskStatus";
import { PRIORITY_LABELS } from "@/constants/priority";
import styles from "./TaskFilters.module.scss";

const ALL = "all";

const TaskFilters = () => {
  const { filters, setFilter, clearFilters } = useUIStore();
  const hasActive = filters.status !== ALL || filters.priority !== ALL;

  return (
    <div className={styles.bar}>
      {/* Status */}
      <div className={styles.group}>
        <button
          className={`${styles.pill} ${filters.status === ALL ? styles.active : ""}`}
          onClick={() => setFilter("status", ALL)}
        >
          All
        </button>
        {Object.entries(STATUS_LABELS).map(([val, label]) => (
          <button
            key={val}
            className={`${styles.pill} ${styles[val]} ${filters.status === val ? styles.active : ""}`}
            onClick={() => setFilter("status", val)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Priority */}
      <div className={styles.group}>
        {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
          <button
            key={val}
            className={`${styles.pill} ${styles[val]} ${filters.priority === val ? styles.active : ""}`}
            onClick={() =>
              setFilter("priority", filters.priority === val ? ALL : val)
            }
          >
            {label}
          </button>
        ))}
      </div>

      {hasActive && (
        <button className={styles.clear} onClick={clearFilters}>
          Clear
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
