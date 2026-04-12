import React, { useState } from 'react';
import TaskCard from '@/components/task/TaskCard/TaskCard';
import TaskInput from '@/components/task/TaskInput/TaskInput';
import useTaskStore from '@/store/taskStore';
import './TodayColumn.scss';

const TodayColumn = ({ title, tasks, showCompleted = true, allowAdd = false, defaultDate = null }) => {
  const [showCompletedSection, setShowCompletedSection] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const toggleTaskComplete = useTaskStore((state) => state.toggleTaskComplete);
  const softDeleteTask = useTaskStore((state) => state.softDeleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const completedTasks = tasks.filter((t) => t.isCompleted);
  const activeTasks = tasks.filter((t) => !t.isCompleted);

  const handleTaskCreated = (newTask) => {
    setShowAddTask(false);
  };

  return (
    <div className="today-column">
      <div className="today-column__header">
        <span className="today-column__title">{title}</span>
        <span className="today-column__count">{activeTasks.length}</span>
        {allowAdd && (
          <button
            className="today-column__add"
            onClick={() => setShowAddTask(!showAddTask)}
            aria-label="Add task"
          >
            +
          </button>
        )}
      </div>

      {allowAdd && showAddTask && (
        <div className="today-column__add-task">
          <TaskInput
            onSubmit={handleTaskCreated}
            defaultDate={defaultDate}
            compact
          />
        </div>
      )}

      <div className="today-column__tasks">
        {activeTasks.map((task) => (
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

      {showCompleted && completedTasks.length > 0 && (
        <div className="today-column__completed">
          <button
            className="today-column__completed-header"
            onClick={() => setShowCompletedSection(!showCompletedSection)}
          >
            <span>Completed ({completedTasks.length})</span>
            <span className={`arrow ${showCompletedSection ? 'open' : ''}`}>▼</span>
          </button>
          {showCompletedSection && (
            <div className="today-column__completed-tasks">
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

export default TodayColumn;
