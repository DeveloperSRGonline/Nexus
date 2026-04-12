import { useState } from "react";
import { Flag, X } from "lucide-react";
import { PRIORITY_COLORS } from "@/constants/priority";
import styles from "./PriorityPicker.module.scss";

const PriorityPicker = ({ value = null, onChange, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSelect = (priority) => {
    onChange(priority);
    if (onClose) onClose();
  };

  return (
    <div className={styles.priorityPicker}>
      <div className={styles.header}>
        <span className={styles.title}>
          <Flag size={14} />
          Priority
        </span>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className={styles.options}>
        {[1, 2, 3, 4].map((priority) => {
          const color = PRIORITY_COLORS[priority];
          const labels = { 1: "P1 - Urgent", 2: "P2 - High", 3: "P3 - Medium", 4: "P4 - Low" };
          const isSelected = value === priority;

          return (
            <button
              key={priority}
              className={`${styles.option} ${isSelected ? styles.selected : ""}`}
              onClick={() => handleSelect(priority)}
              style={{ "--priority-color": color }}
            >
              <span
                className={styles.priorityCircle}
                style={{ backgroundColor: color }}
              />
              <span className={styles.label}>{labels[priority]}</span>
              {isSelected && <span className={styles.checkmark}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PriorityPicker;
