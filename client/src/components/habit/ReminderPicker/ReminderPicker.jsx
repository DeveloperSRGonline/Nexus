import { useState } from "react";
import { Check } from "lucide-react";
import styles from "./ReminderPicker.module.scss";

const ReminderPicker = ({ onConfirm, onClose }) => {
  const [selectedHour, setSelectedHour] = useState(8);
  const [selectedMinute, setSelectedMinute] = useState(0);

  // Generate time options (30-min intervals)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 30];

  const handleConfirm = () => {
    const timeStr = `${String(selectedHour).padStart(2, "0")}:${String(
      selectedMinute
    ).padStart(2, "0")}`;
    onConfirm(timeStr);
  };

  return (
    <div className={styles.reminderPicker} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Set Reminder Time</h3>
        </div>

        <div className={styles.timeSelector}>
          {/* Hour Selector */}
          <div className={styles.selectorColumn}>
            <label className={styles.columnLabel}>Hour</label>
            <div className={styles.scrollList}>
              {hours.map((hour) => {
                const isSelected = hour === selectedHour;
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const period = hour >= 12 ? "PM" : "AM";
                
                return (
                  <button
                    key={hour}
                    type="button"
                    className={`${styles.timeOption} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedHour(hour)}
                  >
                    {displayHour} {period}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minute Selector */}
          <div className={styles.selectorColumn}>
            <label className={styles.columnLabel}>Minute</label>
            <div className={styles.scrollList}>
              {minutes.map((minute) => {
                const isSelected = minute === selectedMinute;
                
                return (
                  <button
                    key={minute}
                    type="button"
                    className={`${styles.timeOption} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {String(minute).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            <Check size={16} />
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPicker;
