import { useState } from "react";
import { MoreHorizontal, Calendar, Trash2, Pencil, Check, Undo, ChevronDown, ChevronRight, FileText, Tag, Paperclip } from "lucide-react";
import { PRIORITY_COLORS } from "@/constants/priority";
import useTaskStore from "@/store/taskStore";
import { dueDateLabel, isOverdue, isToday } from "@/utils/dateUtils";
import styles from "./TaskCard.module.scss";

const TaskCard = ({
  task,
  onClick,
  onToggleComplete,
  onDelete,
  onUpdate,
  compact = false,
  showUncompleteButton = false,
  expandable = true,
}) => {
  const { toggleTaskComplete: storeToggleComplete, softDeleteTask: storeSoftDelete } = useTaskStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Use provided handlers or fall back to store
  const handleToggleComplete = onToggleComplete || storeToggleComplete;
  const handleDelete = onDelete || storeSoftDelete;

  const overdue = task.dueDate && isOverdue(task.dueDate) && !task.isCompleted;
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS[4];

  const onCheckboxClick = (e) => {
    e.stopPropagation();
    handleToggleComplete(task._id);
  };

  const onDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(task._id);
    setMenuOpen(false);
  };

  const onCardClick = () => {
    if (expandable) {
      setExpanded(!expanded);
    }
    onClick?.(task);
  };

  // Calculate progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(st => st.isCompleted).length || 0;
  const hasDetails = totalSubtasks > 0 || task.tags?.length > 0 || task.attachments?.length > 0 || task.description;

  return (
    <div
      className={`${styles.card} ${task.isCompleted ? styles.completed : ""} ${overdue ? styles.overdue : ""} ${compact ? styles.compact : ""}`}
      onClick={onCardClick}
    >
      {/* Priority checkbox circle */}
      <button
        className={styles.checkbox}
        style={{ borderColor: priorityColor }}
        onClick={onCheckboxClick}
      >
        {task.isCompleted && <Check size={12} color="#FFFFFF" />}
      </button>

      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.title}>{task.title}</span>
          <button
            className={styles.menuBtn}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  onClick?.(task);
                  setMenuOpen(false);
                }}
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                className={styles.danger}
                onClick={onDeleteClick}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Meta row below title */}
        <div className={styles.meta}>
          {overdue && <span className={styles.tagOverdue}>Overdue</span>}
          {task.dueDate && isToday(task.dueDate) && (
            <span className={styles.tagToday}>Today</span>
          )}
          {task.listName && <span className={styles.tagList}>{task.listName}</span>}

          {task.dueDate && !isToday(task.dueDate) && !overdue && (
            <span className={styles.date}>
              <Calendar size={11} />
              {dueDateLabel(task.dueDate)}
            </span>
          )}

          {showUncompleteButton && task.isCompleted && (
            <button
              className={styles.uncompleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleComplete(task._id);
              }}
            >
              <Undo size={12} /> Uncomplete
            </button>
          )}
        </div>

        {/* Expanded detail section */}
        {expandable && hasDetails && expanded && (
          <div className={styles.detail} onClick={(e) => e.stopPropagation()}>
            {/* Description */}
            {task.description && (
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <FileText size={14} />
                  <span>Description</span>
                </div>
                <p className={styles.description}>{task.description}</p>
              </div>
            )}

            {/* Subtasks */}
            {totalSubtasks > 0 && (
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <Check size={14} />
                  <span>Subtasks</span>
                  <span className={styles.badge}>{completedSubtasks}/{totalSubtasks}</span>
                </div>
                <div className={styles.subtaskList}>
                  {task.subtasks.map((subtask, idx) => (
                    <div key={idx} className={styles.subtaskItem}>
                      <div
                        className={styles.subtaskCheckbox}
                        style={{
                          borderColor: subtask.isCompleted ? 'var(--color-primary)' : 'var(--color-divider)',
                          backgroundColor: subtask.isCompleted ? 'var(--color-primary)' : 'transparent',
                        }}
                      >
                        {subtask.isCompleted && <Check size={10} color="#FFFFFF" />}
                      </div>
                      <span className={`${styles.subtaskTitle} ${subtask.isCompleted ? styles.subtaskCompleted : ''}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <Tag size={14} />
                  <span>Tags</span>
                </div>
                <div className={styles.tagList}>
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tagChip}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <Paperclip size={14} />
                  <span>Attachments</span>
                </div>
                <div className={styles.attachmentList}>
                  {task.attachments.map((attachment, idx) => (
                    <div key={idx} className={styles.attachmentChip}>
                      <Paperclip size={12} />
                      <span>{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expand indicator */}
        {expandable && hasDetails && (
          <div className={styles.expandIndicator}>
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
