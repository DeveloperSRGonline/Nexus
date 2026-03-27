import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskPriorityBadge from "@/components/task/TaskPriorityBadge/TaskPriorityBadge";
import { dueDateLabel, isOverdue } from "@/utils/dateUtils";
import { Calendar } from "lucide-react";
import styles from "./KanbanCard.module.scss";

const KanbanCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const overdue =
    task.dueDate && isOverdue(task.dueDate) && task.status !== "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.card}
      onClick={() => onClick?.(task)}
      {...attributes}
      {...listeners}
    >
      {task.projectColor && (
        <span
          className={styles.strip}
          style={{ background: task.projectColor }}
        />
      )}

      <div className={styles.body}>
        <p className={styles.title}>{task.title}</p>

        {task.description && <p className={styles.desc}>{task.description}</p>}

        <div className={styles.footer}>
          <TaskPriorityBadge priority={task.priority} size="sm" />
          {task.dueDate && (
            <span className={`${styles.date} ${overdue ? styles.overdue : ""}`}>
              <Calendar size={10} />
              {dueDateLabel(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
