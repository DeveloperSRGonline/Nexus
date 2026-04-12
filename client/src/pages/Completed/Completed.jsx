import React, { useEffect } from 'react';
import useTaskStore from '@/store/taskStore';
import TaskCard from '@/components/task/TaskCard/TaskCard';
import './Completed.scss';

const Completed = () => {
  const fetchCompletedTasks = useTaskStore((state) => state.fetchCompletedTasks);
  const tasks = useTaskStore((state) => state.tasks || []);
  const isLoading = useTaskStore((state) => state.isLoading);
  const toggleTaskComplete = useTaskStore((state) => state.toggleTaskComplete);
  const softDeleteTask = useTaskStore((state) => state.softDeleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

  const handleUncomplete = async (taskId) => {
    await toggleTaskComplete(taskId);
    // Refetch to update the list
    fetchCompletedTasks();
  };

  if (isLoading) {
    return (
      <div className="page completed-page">
        <div className="completed-page__loading">Loading completed tasks...</div>
      </div>
    );
  }

  return (
    <div className="page completed-page">
      <div className="completed-page__header">
        <h1>Completed</h1>
        <span className="completed-page__count">{tasks.length} tasks</span>
      </div>

      <div className="completed-page__content">
        {tasks.length === 0 ? (
          <div className="completed-page__empty">
            <p>No completed tasks yet.</p>
            <p className="completed-page__empty-hint">Completed tasks will appear here!</p>
          </div>
        ) : (
          <div className="completed-page__list">
            {tasks.map((task) => (
              <div key={task._id} className="completed-task-row">
                <TaskCard
                  task={task}
                  onToggleComplete={() => handleUncomplete(task._id)}
                  onDelete={softDeleteTask}
                  onUpdate={updateTask}
                  showUncompleteButton
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;
