import { useState } from "react";
import { Plus, X, Check, Pencil } from "lucide-react";
import useTaskStore from "@/store/taskStore";
import styles from "./SubtaskList.module.scss";

const SubtaskList = ({ taskId, subtasks }) => {
  const { updateTask } = useTaskStore();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    const updatedSubtasks = [
      ...(subtasks || []),
      { title: newSubtaskTitle.trim(), isCompleted: false },
    ];

    updateTask(taskId, { subtasks: updatedSubtasks });
    setNewSubtaskTitle("");
    setIsAdding(false);
  };

  const handleToggleSubtask = (idx) => {
    const updatedSubtasks = subtasks.map((st, i) =>
      i === idx ? { ...st, isCompleted: !st.isCompleted } : st
    );
    updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (idx) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== idx);
    updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const handleStartEdit = (idx) => {
    setEditingIdx(idx);
    setEditTitle(subtasks[idx].title);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || editingIdx === null) return;

    const updatedSubtasks = subtasks.map((st, i) =>
      i === editingIdx ? { ...st, title: editTitle.trim() } : st
    );
    updateTask(taskId, { subtasks: updatedSubtasks });
    setEditingIdx(null);
    setEditTitle("");
  };

  const handleCancelEdit = () => {
    setEditingIdx(null);
    setEditTitle("");
  };

  // Calculate progress
  const total = subtasks?.length || 0;
  const completed = subtasks?.filter(st => st.isCompleted).length || 0;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={styles.container}>
      {/* Progress bar */}
      {total > 0 && (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressCount}>{completed}/{total}</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>
      )}

      {/* Subtask items */}
      {total > 0 && (
        <div className={styles.subtasks}>
          {subtasks.map((subtask, idx) => (
            <div key={idx} className={styles.subtaskItem}>
              <button
                className={styles.checkbox}
                style={{
                  borderColor: subtask.isCompleted ? 'var(--color-primary)' : 'var(--color-divider)',
                  backgroundColor: subtask.isCompleted ? 'var(--color-primary)' : 'transparent',
                }}
                onClick={() => handleToggleSubtask(idx)}
              >
                {subtask.isCompleted && <Check size={10} color="#FFFFFF" />}
              </button>

              {editingIdx === idx ? (
                <input
                  type="text"
                  className={styles.editInput}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className={`${styles.subtaskTitle} ${subtask.isCompleted ? styles.completed : ''}`}
                  onDoubleClick={() => handleStartEdit(idx)}
                >
                  {subtask.title}
                </span>
              )}

              <div className={styles.actions}>
                {editingIdx === idx ? (
                  <>
                    <button className={styles.iconBtn} onClick={handleSaveEdit}>
                      <Check size={14} />
                    </button>
                    <button className={styles.iconBtn} onClick={handleCancelEdit}>
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleStartEdit(idx)}
                      title="Edit subtask"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.delete}`}
                      onClick={() => handleDeleteSubtask(idx)}
                      title="Delete subtask"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add subtask input */}
      {isAdding ? (
        <div className={styles.addSubtask}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter subtask title..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSubtask();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setNewSubtaskTitle("");
              }
            }}
            autoFocus
          />
          <button className={styles.btnPrimary} onClick={handleAddSubtask}>
            Add
          </button>
          <button className={styles.btnGhost} onClick={() => {
            setIsAdding(false);
            setNewSubtaskTitle("");
          }}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          className={styles.addBtn}
          onClick={() => setIsAdding(true)}
        >
          <Plus size={14} />
          <span>Add subtask</span>
        </button>
      )}
    </div>
  );
};

export default SubtaskList;
