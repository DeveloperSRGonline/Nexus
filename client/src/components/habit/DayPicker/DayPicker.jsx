import React from "react";
import styles from "./DayPicker.module.scss";

const DAYS = [
  { value: 0, label: "S" },
  { value: 1, label: "M" },
  { value: 2, label: "T" },
  { value: 3, label: "W" },
  { value: 4, label: "T" },
  { value: 5, label: "F" },
  { value: 6, label: "S" },
];

const DayPicker = ({ selectedDays, onChange, onClose }) => {
  const toggleDay = (dayValue) => {
    if (selectedDays.includes(dayValue)) {
      // Don't allow deselecting all days
      if (selectedDays.length === 1) return;
      onChange(selectedDays.filter((d) => d !== dayValue));
    } else {
      onChange([...selectedDays, dayValue].sort());
    }
  };

  const selectAll = () => {
    onChange([0, 1, 2, 3, 4, 5, 6]);
  };

  return (
    <div className={styles.dayPicker} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Select Days</h3>
          <button className={styles.selectAllButton} onClick={selectAll}>
            All
          </button>
        </div>

        <div className={styles.daysGrid}>
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                className={`${styles.dayCircle} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayPicker;
