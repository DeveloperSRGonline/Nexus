import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import TaskPriorityBadge from "@/components/task/TaskPriorityBadge/TaskPriorityBadge";
import TaskForm from "@/components/task/TaskForm/TaskForm";
import styles from "./CalendarView.module.scss";

const CalendarView = ({ tasks }) => {
  const [current, setCurrent] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Build calendar grid
  const weeks = [];
  let day = startDate;
  while (day <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const getTasksForDay = (d) =>
    tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), d));

  const handleDayClick = (d, dayTasks) => {
    setSelectedDay(d);
  };

  return (
    <div className={styles.wrapper}>
      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={() => setCurrent(subMonths(current, 1))}
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className={styles.month}>{format(current, "MMMM yyyy")}</h3>
        <button
          className={styles.navBtn}
          onClick={() => setCurrent(addMonths(current, 1))}
        >
          <ChevronRight size={16} />
        </button>
        <button
          className={styles.todayBtn}
          onClick={() => setCurrent(new Date())}
        >
          Today
        </button>
      </div>

      {/* Day labels */}
      <div className={styles.dayLabels}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d} className={styles.dayLabel}>
            {d}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {weeks.map((week, wi) =>
          week.map((d) => {
            const dayTasks = getTasksForDay(d);
            const inMonth = isSameMonth(d, current);
            const todayClass = isToday(d);
            const selected = selectedDay && isSameDay(d, selectedDay);

            return (
              <div
                key={d.toString()}
                className={`
                  ${styles.cell}
                  ${!inMonth ? styles.outside : ""}
                  ${todayClass ? styles.today : ""}
                  ${selected ? styles.selected : ""}
                `}
                onClick={() => handleDayClick(d, dayTasks)}
              >
                <span className={styles.dateNum}>{format(d, "d")}</span>
                <div className={styles.taskDots}>
                  {dayTasks.slice(0, 3).map((t) => (
                    <span
                      key={t._id}
                      className={styles.dot}
                      data-priority={t.priority}
                      title={t.title}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditTask(t);
                        setShowForm(true);
                      }}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className={styles.more}>+{dayTasks.length - 3}</span>
                  )}
                </div>
              </div>
            );
          }),
        )}
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className={styles.dayDetail}>
          <div className={styles.detailHeader}>
            <span>{format(selectedDay, "EEEE, MMMM d")}</span>
            <button
              className={styles.addBtn}
              onClick={() => {
                setEditTask(null);
                setShowForm(true);
              }}
            >
              + Add Task
            </button>
          </div>
          {getTasksForDay(selectedDay).length === 0 ? (
            <p className={styles.noTasks}>No tasks due this day</p>
          ) : (
            <div className={styles.detailList}>
              {getTasksForDay(selectedDay).map((t) => (
                <div
                  key={t._id}
                  className={styles.detailTask}
                  onClick={() => {
                    setEditTask(t);
                    setShowForm(true);
                  }}
                >
                  <TaskPriorityBadge priority={t.priority} size="sm" />
                  <span>{t.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <TaskForm
          task={editTask}
          onClose={() => {
            setShowForm(false);
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
};

export default CalendarView;
