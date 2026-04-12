import React, { useEffect } from 'react';
import useTaskStore from '@/store/taskStore';
import TaskCard from '@/components/task/TaskCard/TaskCard';
import './Trash.scss';

const Trash = () => {
  const fetchTrashedTasks = useTaskStore((state) => state.fetchTrashedTasks);
  const emptyTrash = useTaskStore((state) => state.emptyTrash);
  const restoreTask = useTaskStore((state) => state.restoreTask);
  const permanentDeleteTask = useTaskStore((state) => state.permanentDeleteTask);
  const tasks = useTaskStore((state) => state.tasks || []);
  const isLoading = useTaskStore((state) => state.isLoading);

  useEffect(() => {
    fetchTrashedTasks();
  }, [fetchTrashedTasks]);

  const handleRestore = async (taskId) => {
    await restoreTask(taskId);
    fetchTrashedTasks();
  };

  const handlePermanentDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      await permanentDeleteTask(taskId);
      fetchTrashedTasks();
    }
  };

  const handleEmptyTrash = async () => {
    if (window.confirm('Are you sure you want to empty the trash? All tasks will be permanently deleted.')) {
      await emptyTrash();
      fetchTrashedTasks();
    }
  };

  if (isLoading) {
    return (
      <div className="page trash-page">
        <div className="trash-page__loading">Loading trash...</div>
      </div>
    );
  }

  return (
    <div className="page trash-page">
      <div className="trash-page__header">
        <div className="trash-page__title-row">
          <h1>Trash</h1>
          <span className="trash-page__count">{tasks.length} tasks</span>
        </div>
        <p className="trash-page__subtitle">Tasks in trash are automatically deleted after 30 days.</p>
        {tasks.length > 0 && (
          <button className="trash-page__empty-btn" onClick={handleEmptyTrash}>
            Empty Trash
          </button>
        )}
      </div>

      <div className="trash-page__content">
        {tasks.length === 0 ? (
          <div className="trash-page__empty">
            <p>Trash is empty</p>
            <p className="trash-page__empty-hint">Deleted tasks will appear here</p>
          </div>
        ) : (
          <div className="trash-page__list">
            {tasks.map((task) => (
              <div key={task._id} className="trash-task-row">
                <TaskCard
                  task={task}
                  onToggleComplete={() => {}}
                  onDelete={() => {}}
                  onUpdate={() => {}}
                />
                <div className="trash-task__actions">
                  <button
                    className="trash-task__restore-btn"
                    onClick={() => handleRestore(task._id)}
                  >
                    Restore
                  </button>
                  <button
                    className="trash-task__delete-btn"
                    onClick={() => handlePermanentDelete(task._id)}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trash;
