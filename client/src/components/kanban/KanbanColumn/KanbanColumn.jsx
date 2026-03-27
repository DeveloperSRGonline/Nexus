import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import KanbanCard from "../KanbanCard/KanbanCard";
import styles from "./KanbanColumn.module.scss";

const COLUMN_COLORS = {
  todo: "#555555",
  in_progress: "#3b82f6",
  review: "#f59e0b",
  done: "#22c55e",
};

const COLUMN_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

const KanbanColumn = ({ status, tasks, onCardClick, onAddClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={`${styles.column} ${isOver ? styles.over : ""}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.label}>
          <span
            className={styles.dot}
            style={{ background: COLUMN_COLORS[status] }}
          />
          <span className={styles.title}>{COLUMN_LABELS[status]}</span>
          <span className={styles.count}>{tasks.length}</span>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => onAddClick?.(status)}
          title={`Add task to ${COLUMN_LABELS[status]}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className={styles.cards}>
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard key={task._id} task={task} onClick={onCardClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && <div className={styles.empty}>Drop here</div>}
      </div>
    </div>
  );
};

export default KanbanColumn;
