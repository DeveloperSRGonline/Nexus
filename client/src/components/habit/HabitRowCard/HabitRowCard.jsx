import React, { useMemo } from "react";
import useHabitStore from "@/store/habitStore";
import "./HabitRowCard.scss";

const HabitRowCard = ({ habit, onOpenDetail }) => {
  const { toggleCheckIn } = useHabitStore();

  // Calculate 7-day rolling window
  const sevenDays = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateNum = date.getDate();
      const isToday = i === 0;
      
      days.push({
        date: dateStr,
        dayName,
        dateNum,
        isToday,
      });
    }
    
    return days;
  }, []);

  // Get completion status for each day
  const getDayStatus = (dateStr) => {
    const log = habit.logs?.find((log) => log.date === dateStr);
    return log?.completed ? "completed" : "incomplete";
  };

  // Calculate streak and count
  const stats = useMemo(() => {
    const logs = habit.logs || [];
    const completedCount = logs.filter((log) => log.completed).length;
    
    // Calculate current streak
    let streak = 0;
    const today = new Date();
    const checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const log = logs.find((l) => l.date === dateStr && l.completed);
      
      if (log) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today has no log yet, check yesterday
        if (dateStr === today.toISOString().split("T")[0] && !log) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    
    return { streak, completedCount };
  }, [habit.logs]);

  const handleCheckIn = async (dateStr) => {
    await toggleCheckIn(habit._id, dateStr);
  };

  const handleClick = () => {
    if (onOpenDetail) {
      onOpenDetail(habit);
    }
  };

  return (
    <div 
      className="habit-row-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Left: Emoji + Name + Meta */}
      <div className="habit-info">
        <div className="habit-emoji" style={{ fontSize: "20px" }}>
          {habit.emoji}
        </div>
        <div className="habit-details">
          <h3 className="habit-name">{habit.name}</h3>
          <div className="habit-meta">
            {stats.streak > 0 && (
              <span className="streak-badge">
                🔥 {stats.streak}
              </span>
            )}
            <span className="count-badge">
              {stats.completedCount} days
            </span>
          </div>
        </div>
      </div>

      {/* Right: 7 check-in circles */}
      <div className="habit-checkins">
        {sevenDays.map((day) => {
          const status = getDayStatus(day.date);
          const isScheduled = habit.scheduledDays.includes(
            new Date(day.date).getDay()
          );

          return (
            <div
              key={day.date}
              className={`checkin-day ${status} ${day.isToday ? "today" : ""} ${
                !isScheduled ? "not-scheduled" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isScheduled) {
                  handleCheckIn(day.date);
                }
              }}
              title={`${day.dayName}, ${day.dateNum}`}
            >
              <div className="checkin-circle">
                {status === "completed" && (
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
              <span className="day-label">{day.dayName.charAt(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitRowCard;
