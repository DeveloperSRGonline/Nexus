import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import TaskList from "@/components/task/TaskList/TaskList";
import TaskInput from "@/components/task/TaskInput/TaskInput";
import ViewOptions from "@/components/task/ViewOptions/ViewOptions";
import useTaskStore from "@/store/taskStore";
import useListStore from "@/store/listStore";
import styles from "./Inbox.module.scss";

const Inbox = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { seedDefaultLists } = useListStore();
  const [showViewOptions, setShowViewOptions] = useState(false);

  // Fetch tasks and seed default lists on mount
  useEffect(() => {
    fetchTasks();
    seedDefaultLists();
  }, [fetchTasks, seedDefaultLists]);

  // Filter tasks for Inbox (no list assigned or default list)
  const inboxTasks = tasks.filter((t) => !t.listId);

  return (
    <div className={styles.inboxPage}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Inbox</h1>
        <button
          className={styles.viewOptionsBtn}
          onClick={() => setShowViewOptions(!showViewOptions)}
          aria-label="View options"
        >
          <SlidersHorizontal size={18} />
        </button>
      </header>

      {/* View Options Dropdown */}
      {showViewOptions && (
        <div className={styles.viewOptionsContainer}>
          <ViewOptions onClose={() => setShowViewOptions(false)} />
        </div>
      )}

      {/* Task Input */}
      <div className={styles.taskInputContainer}>
        <TaskInput
          placeholder="Add a task to Inbox..."
          defaultListId={null}
        />
      </div>

      {/* Task List */}
      <div className={styles.taskListContainer}>
        <TaskList
          tasks={inboxTasks}
          showCompleted={true}
          emptyMessage="No tasks in Inbox. Add your first task above!"
        />
      </div>
    </div>
  );
};

export default Inbox;
