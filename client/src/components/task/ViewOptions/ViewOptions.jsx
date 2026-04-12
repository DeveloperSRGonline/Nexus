import { useState } from "react";
import { X } from "lucide-react";
import styles from "./ViewOptions.module.scss";

const ViewOptions = ({ onClose }) => {
  const [groupBy, setGroupBy] = useState("none");
  const [sortBy, setSortBy] = useState("date");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  return (
    <div className={styles.viewOptions}>
      <div className={styles.header}>
        <h3 className={styles.title}>View Options</h3>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.options}>
        <div className={styles.optionGroup}>
          <label className={styles.label}>Group by</label>
          <select
            className={styles.select}
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="none">None</option>
            <option value="priority">Priority</option>
            <option value="date">Date</option>
            <option value="list">List</option>
          </select>
        </div>

        <div className={styles.optionGroup}>
          <label className={styles.label}>Sort by</label>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className={styles.optionGroup}>
          <label className={styles.label}>Hide Completed</label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={(e) => setHideCompleted(e.target.checked)}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>

        <div className={styles.optionGroup}>
          <label className={styles.label}>View Mode</label>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.btn} ${viewMode === "list" ? styles.active : ""}`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
            <button
              className={`${styles.btn} ${viewMode === "kanban" ? styles.active : ""}`}
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOptions;
