import React, { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import useHabitStore from "@/store/habitStore";
import styles from "./HabitLogSection.module.scss";

const HabitLogSection = ({ logs = [] }) => {
  const { setLogNote } = useHabitStore();
  const [editingLogId, setEditingLogId] = useState(null);
  const [editNote, setEditNote] = useState("");

  const sortedLogs = [...logs]
    .filter((log) => log.completed || log.logNote)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleStartEdit = (log) => {
    setEditingLogId(log._id);
    setEditNote(log.logNote || "");
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditNote("");
  };

  const handleSaveEdit = async (logId) => {
    await setLogNote(logId, editNote);
    setEditingLogId(null);
    setEditNote("");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (sortedLogs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No habit logs yet. Start checking in to see your progress!</p>
      </div>
    );
  }

  return (
    <div className={styles.habitLogSection}>
      <h3 className={styles.sectionTitle}>Habit Log</h3>

      <div className={styles.logsList}>
        {sortedLogs.map((log) => (
          <div key={log._id} className={styles.logEntry}>
            <div className={styles.logHeader}>
              <span className={styles.logDate}>{formatDate(log.date)}</span>
              {editingLogId !== log._id && (
                <button
                  className={styles.editButton}
                  onClick={() => handleStartEdit(log)}
                  aria-label="Edit note"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>

            {editingLogId === log._id ? (
              <div className={styles.editMode}>
                <textarea
                  className={styles.noteTextarea}
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Add a journal note..."
                  rows={3}
                  autoFocus
                />
                <div className={styles.editActions}>
                  <button
                    className={styles.cancelEditButton}
                    onClick={handleCancelEdit}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    className={styles.saveNoteButton}
                    onClick={() => handleSaveEdit(log._id)}
                  >
                    <Check size={16} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.logContent}>
                {log.logNote ? (
                  <p className={styles.logNote}>{log.logNote}</p>
                ) : (
                  <p className={styles.logNotePlaceholder}>
                    Click edit to add a journal note...
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitLogSection;
