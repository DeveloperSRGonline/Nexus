import React, { useEffect } from 'react';
import useTaskStore from '@/store/taskStore';
import useHabitStore from '@/store/habitStore';
import OverdueColumn from '@/components/task/OverdueColumn/OverdueColumn';
import TodayColumn from '@/components/task/TodayColumn/TodayColumn';
import './Today.scss';

const Today = () => {
  const fetchTodayTasks = useTaskStore((state) => state.fetchTodayTasks);
  const overdueTasks = useTaskStore((state) => state.overdueTasks || []);
  const todayTasks = useTaskStore((state) => state.todayTasks || []);
  const isLoading = useTaskStore((state) => state.isLoading);
  
  const { fetchTodayHabits, todayHabits = [], toggleCheckIn } = useHabitStore();
  
  useEffect(() => {
    fetchTodayTasks();
    fetchTodayHabits();
  }, [fetchTodayTasks, fetchTodayHabits]);

  // Get today's date in YYYY-MM-DD format for default date picker
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];
  
  // Calculate habits count
  const habitsCount = todayHabits?.length || 0;

  if (isLoading) {
    return (
      <div className="page today-page">
        <div className="today-page__loading">Loading today's tasks...</div>
      </div>
    );
  }

  return (
    <div className="page today-page">
      <div className="today-page__header">
        <h1>Today</h1>
      </div>

      <div className="today-page__columns">
        <OverdueColumn tasks={overdueTasks} showCompleted />

        <TodayColumn
          title="Today"
          tasks={todayTasks}
          showCompleted
          allowAdd
          defaultDate={todayISO}
        />

        <div className="today-column today-column--habits">
          <div className="today-column__header">
            <span className="today-column__title">Today's Habits</span>
            <span className="today-column__count">{habitsCount}</span>
          </div>
          
          <div className="today-column__habits">
            {habitsCount === 0 ? (
              <div className="today-column__empty">
                <p>No habits scheduled for today</p>
              </div>
            ) : (
              todayHabits.map((habit) => {
                const isCompleted = habit.todayLog?.completed || false;
                return (
                  <div 
                    key={habit._id} 
                    className="habit-card-today"
                    onClick={() => toggleCheckIn(habit._id, todayISO)}
                  >
                    <div className="habit-card-today__checkbox">
                      {isCompleted && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="habit-card-today__emoji">{habit.emoji}</span>
                    <span className="habit-card-today__name">{habit.name}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;
