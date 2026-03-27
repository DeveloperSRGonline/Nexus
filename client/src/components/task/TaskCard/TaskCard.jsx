import { useState } from "react";
import { MoreHorizontal, Calendar, Trash2, Pencil } from "lucide-react";
import TaskStatusBadge from "../TaskStatusBadge/TaskStatusBadge";
import TaskPriorityBadge from "../TaskPriorityBadge/TaskPriorityBadge";
import useTaskStore from "@/store/taskStore";
import { dueDateLabel, isOverdue } from "@/utils/dateUtils";
import styles from "./TaskCard.module.scss";

const TaskCard = ({ task, onClick }) => {
  const { deleteTask } = useTaskStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const overdue =
    task.dueDate && isOverdue(task.dueDate) && task.status !== "done";

  return (
    <div className={styles.card} onClick={() => onClick?.(task)}>
      {/* Left accent strip — project color */}
      {task.projectColor && (
        <span
          className={styles.strip}
          style={{ background: task.projectColor }}
        />
      )}

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
                onClick={() => {
                  deleteTask(task._id);
                  setMenuOpen(false);
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>

        {task.description && <p className={styles.desc}>{task.description}</p>}

        <div className={styles.meta}>
          <TaskPriorityBadge priority={task.priority} size="sm" />
          <TaskStatusBadge status={task.status} size="sm" />

          {task.dueDate && (
            <span className={`${styles.date} ${overdue ? styles.overdue : ""}`}>
              <Calendar size={11} />
              {dueDateLabel(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
