import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import TaskCard from "../TaskCard/TaskCard";
import styles from "./TaskList.module.scss";

const TaskList = ({ 
  tasks, 
  showCompleted = true, 
  onTaskClick,
  emptyMessage = "No tasks yet. Add your first task!" 
}) => {
  const [completedCollapsed, setCompletedCollapsed] = useState(false);

  // Separate active and completed tasks
  const { activeTasks, completedTasks } = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (task.isCompleted) {
          acc.completedTasks.push(task);
        } else {
          acc.activeTasks.push(task);
        }
        return acc;
      },
      { activeTasks: [], completedTasks: [] }
    );
  }, [tasks]);

  const toggleCompleted = () => {
    setCompletedCollapsed(!completedCollapsed);
  };

  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {/* Active tasks */}
      {activeTasks.map((task) => (
        <TaskCard key={task._id} task={task} onClick={onTaskClick} />
      ))}

      {/* Completed section */}
      {showCompleted && completedTasks.length > 0 && (
        <div className={styles.completedSection}>
          <button
            className={styles.completedHeader}
            onClick={toggleCompleted}
          >
            {completedCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
            <span className={styles.completedLabel}>
              Completed ({completedTasks.length})
            </span>
          </button>

          {!completedCollapsed && (
            <div className={styles.completedList}>
              {completedTasks.map((task) => (
                <TaskCard key={task._id} task={task} onClick={onTaskClick} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
