import React, { useMemo } from "react";
import styles from "./CalendarHeatmap.module.scss";

const CalendarHeatmap = ({ logs = [], habitId }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const todayStr = today.toISOString().split("T")[0];

  // Calculate calendar data
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Create array of weeks
    const weeks = [];
    let currentWeek = [];

    // Add empty cells for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split("T")[0];
      const isToday = dateStr === todayStr;
      const log = logs.find((l) => l.date === dateStr);
      const isCompleted = log?.completed || false;
      const isScheduled = true; // Simplified - could check habit.scheduledDays

      currentWeek.push({
        day,
        date: dateStr,
        isToday,
        isCompleted,
        isScheduled,
      });

      // Start new week on Saturday
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, monthName: today.toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
  }, [currentYear, currentMonth, logs, todayStr]);

  return (
    <div className={styles.calendarHeatmap}>
      <h3 className={styles.monthLabel}>{calendarData.monthName}</h3>

      {/* Day headers */}
      <div className={styles.weekHeader}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className={styles.dayLabel}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.calendarGrid}>
        {calendarData.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className={styles.weekRow}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return <div key={`empty-${dayIndex}`} className={styles.emptyCell} />;
              }

              return (
                <div
                  key={day.date}
                  className={`${styles.dayCell} ${day.isToday ? styles.today : ""} ${
                    day.isCompleted ? styles.completed : ""
                  }`}
                  title={`${day.date}${day.isCompleted ? " ✓" : ""}`}
                >
                  <span className={styles.dayNumber}>{day.day}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeatmap;
