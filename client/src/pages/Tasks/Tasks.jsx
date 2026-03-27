import { useEffect, useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import useTaskStore from "@/store/taskStore";
import useUIStore from "@/store/uiStore";
import TaskCard from "@/components/task/TaskCard/TaskCard";
import TaskForm from "@/components/task/TaskForm/TaskForm";
import TaskFilters from "@/components/task/TaskFilters/TaskFilters";
import KanbanBoard from "@/components/kanban/KanbanBoard/KanbanBoard";
import CalendarView from "@/components/calendar/CalendarView/CalendarView";
import TimelineView from "@/components/timeline/TimelineView/TimelineView";
import ViewSwitcher from "@/components/ui/ViewSwitcher/ViewSwitcher";
import Spinner from "@/components/ui/Spinner/Spinner";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import Button from "@/components/ui/Button/Button";
import { groupByStatus, filterTasks } from "@/utils/taskUtils";
import { VIEW_MODES } from "@/constants/viewModes";
import { STATUS_LABELS } from "@/constants/taskStatus";
import styles from "./Tasks.module.scss";

const STATUS_ORDER = ["todo", "in_progress", "review", "done", "cancelled"];

const Tasks = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const { filters, viewMode, setViewMode } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const filtered = filterTasks(tasks, filters);
  const grouped = groupByStatus(filtered);

  const openCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };
  const openEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <CheckSquare size={22} color="#a3e635" />
          <h1>Tasks</h1>
          <span className={styles.count}>{tasks.length}</span>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={openCreate}
        >
          New Task
        </Button>
      </div>

      {/* Controls row */}
      <div className={styles.controls}>
        <ViewSwitcher active={viewMode} onChange={setViewMode} />
        {viewMode === VIEW_MODES.LIST && <TaskFilters />}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={styles.loader}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* LIST */}
          {viewMode === VIEW_MODES.LIST &&
            (filtered.length === 0 ? (
              <EmptyState
                icon="✓"
                title="No tasks found"
                description="Create your first task to get started"
                action={
                  <Button variant="primary" onClick={openCreate}>
                    New Task
                  </Button>
                }
              />
            ) : (
              <div className={styles.groups}>
                {STATUS_ORDER.map((status) => {
                  const group = grouped[status];
                  if (!group?.length) return null;
                  return (
                    <div key={status} className={styles.group}>
                      <div className={styles.groupHeader}>
                        <span
                          className={`${styles.groupDot} ${styles[status]}`}
                        />
                        <span className={styles.groupLabel}>
                          {STATUS_LABELS[status]}
                        </span>
                        <span className={styles.groupCount}>
                          {group.length}
                        </span>
                      </div>
                      <div className={styles.taskList}>
                        {group.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onClick={openEdit}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* KANBAN */}
          {viewMode === VIEW_MODES.KANBAN && <KanbanBoard tasks={filtered} />}

          {/* CALENDAR */}
          {viewMode === VIEW_MODES.CALENDAR && (
            <CalendarView tasks={filtered} />
          )}

          {/* TIMELINE */}
          {viewMode === VIEW_MODES.TIMELINE && (
            <TimelineView tasks={filtered} />
          )}
        </>
      )}

      {showForm && viewMode === VIEW_MODES.LIST && (
        <TaskForm task={editingTask} onClose={closeForm} />
      )}
    </div>
  );
};

export default Tasks;
