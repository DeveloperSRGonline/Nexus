import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "../KanbanColumn/KanbanColumn";
import KanbanCard from "../KanbanCard/KanbanCard";
import TaskForm from "@/components/task/TaskForm/TaskForm";
import useTaskStore from "@/store/taskStore";
import { groupByStatus } from "@/utils/taskUtils";
import styles from "./KanbanBoard.module.scss";

const COLUMNS = ["todo", "in_progress", "review", "done"];

const KanbanBoard = ({ tasks }) => {
  const { updateTaskStatus } = useTaskStore();
  const [activeTask, setActiveTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const grouped = groupByStatus(tasks);

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const newStatus = COLUMNS.includes(over.id)
      ? over.id
      : tasks.find((t) => t._id === over.id)?.status;

    if (!newStatus) return;

    const dragged = tasks.find((t) => t._id === active.id);
    if (dragged && dragged.status !== newStatus) {
      updateTaskStatus(active.id, newStatus);
    }
  };

  const openAddForm = (status) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setDefaultStatus(null);
    setShowForm(true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={grouped[status] || []}
              onCardClick={openEditForm}
              onAddClick={openAddForm}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <KanbanCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      {showForm && (
        <TaskForm
          task={editingTask}
          defaultStatus={defaultStatus}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
};

export default KanbanBoard;
