import React, { useEffect, useState } from 'react';
import useTaskStore from '@/store/taskStore';
import TaskCard from '@/components/task/TaskCard/TaskCard';
import DateGroupHeader from '@/components/task/DateGroupHeader/DateGroupHeader';
import './Next7Days.scss';

const Next7Days = () => {
  const fetchNext7DaysTasks = useTaskStore((state) => state.fetchNext7DaysTasks);
  const next7DaysTasks = useTaskStore((state) => state.next7DaysTasks || {});
  const next7DaysTotal = useTaskStore((state) => state.next7DaysTotal || 0);
  const isLoading = useTaskStore((state) => state.isLoading);
  const toggleTaskComplete = useTaskStore((state) => state.toggleTaskComplete);
  const softDeleteTask = useTaskStore((state) => state.softDeleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const [collapsedDates, setCollapsedDates] = useState({});

  useEffect(() => {
    fetchNext7DaysTasks();
  }, [fetchNext7DaysTasks]);

  const handleToggleCollapse = (date) => {
    setCollapsedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Sort dates chronologically
  const sortedDates = Object.keys(next7DaysTasks).sort();

  if (isLoading) {
    return (
      <div className="page next-7-days-page">
        <div className="next-7-days-page__loading">Loading next 7 days...</div>
      </div>
    );
  }

  return (
    <div className="page next-7-days-page">
      <div className="next-7-days-page__header">
        <h1>Next 7 Days</h1>
        <span className="next-7-days-page__count">{next7DaysTotal} tasks</span>
      </div>

      <div className="next-7-days-page__content">
        {sortedDates.length === 0 ? (
          <div className="next-7-days-page__empty">
            <p>No tasks scheduled for the next 7 days.</p>
            <p className="next-7-days-page__empty-hint">Add tasks with due dates to see them here!</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="date-group">
              <DateGroupHeader
                date={date}
                taskCount={next7DaysTasks[date].length}
                isCollapsed={collapsedDates[date]}
                onToggle={() => handleToggleCollapse(date)}
              />
              {!collapsedDates[date] && (
                <div className="date-group__tasks">
                  {next7DaysTasks[date].map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onDelete={softDeleteTask}
                      onUpdate={updateTask}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Next7Days;
