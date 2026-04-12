import React, { useState } from 'react';
import TaskCard from '@/components/task/TaskCard/TaskCard';
import useTaskStore from '@/store/taskStore';
import './OverdueColumn.scss';

const OverdueColumn = ({ tasks, showCompleted = true }) => {
  const [showCompletedSection, setShowCompletedSection] = useState(false);
  const toggleTaskComplete = useTaskStore((state) => state.toggleTaskComplete);
  const softDeleteTask = useTaskStore((state) => state.softDeleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const postponeTask = useTaskStore((state) => state.postponeTask);

  const completedTasks = tasks.filter((t) => t.isCompleted);
  const activeTasks = tasks.filter((t) => !t.isCompleted);

  const handlePostponeAll = async () => {
    for (const task of activeTasks) {
      await postponeTask(task._id);
    }
  };

  const handlePostpone = async (taskId) => {
    await postponeTask(taskId);
  };

  return (
    <div className="overdue-column">
      <div className="overdue-column__header">
        <div className="overdue-column__title-row">
          <span className="overdue-column__title">Overdue</span>
          <span className="overdue-column__count">{activeTasks.length}</span>
        </div>
        {activeTasks.length > 0 && (
          <button
            className="overdue-column__postpone-all"
            onClick={handlePostponeAll}
          >
            Postpone All
          </button>
        )}
      </div>

      <div className="overdue-column__tasks">
        {activeTasks.map((task) => (
          <div key={task._id} className="overdue-column__task-row">
            <TaskCard
              task={task}
              onToggleComplete={toggleTaskComplete}
              onDelete={softDeleteTask}
              onUpdate={updateTask}
              compact
            />
            <button
              className="overdue-column__postpone"
              onClick={() => handlePostpone(task._id)}
              aria-label="Postpone task to tomorrow"
            >
              Postpone
            </button>
          </div>
        ))}
      </div>

      {showCompleted && completedTasks.length > 0 && (
        <div className="overdue-column__completed">
          <button
            className="overdue-column__completed-header"
            onClick={() => setShowCompletedSection(!showCompletedSection)}
          >
            <span>Completed ({completedTasks.length})</span>
            <span className={`arrow ${showCompletedSection ? 'open' : ''}`}>▼</span>
          </button>
          {showCompletedSection && (
            <div className="overdue-column__completed-tasks">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={toggleTaskComplete}
                  onDelete={softDeleteTask}
                  onUpdate={updateTask}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OverdueColumn;
