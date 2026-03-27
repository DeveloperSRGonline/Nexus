import { useMemo } from "react";
import {
  format,
  differenceInDays,
  startOfDay,
  addDays,
  min,
  max,
} from "date-fns";
import styles from "./TimelineView.module.scss";

const CELL_WIDTH = 40; // px per day
const DAYS_SHOWN = 30;

const TimelineView = ({ tasks }) => {
  const today = startOfDay(new Date());

  // Only tasks with dates
  const dated = tasks.filter((t) => t.dueDate);

  // Date range: today-5 to today+25
  const rangeStart = addDays(today, -5);
  const days = Array.from({ length: DAYS_SHOWN }, (_, i) =>
    addDays(rangeStart, i),
  );

  const getBar = (task) => {
    const start = task.startDate
      ? startOfDay(new Date(task.startDate))
      : startOfDay(new Date(task.dueDate));
    const end = startOfDay(new Date(task.dueDate));
    const left = differenceInDays(start, rangeStart) * CELL_WIDTH;
    const width = Math.max(
      (differenceInDays(end, start) + 1) * CELL_WIDTH,
      CELL_WIDTH,
    );
    return { left, width };
  };

  const PRIORITY_COLORS = {
    urgent: "#ef4444",
    high: "#f59e0b",
    medium: "#3b82f6",
    low: "#6b7280",
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.scroll}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.labelCol} />
          <div className={styles.grid}>
            {days.map((d) => (
              <div
                key={d.toString()}
                className={`${styles.headerCell} ${
                  differenceInDays(d, today) === 0 ? styles.todayCol : ""
                }`}
                style={{ width: CELL_WIDTH }}
              >
                <span className={styles.dayNum}>{format(d, "d")}</span>
                <span className={styles.dayName}>{format(d, "EEE")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {dated.length === 0 ? (
          <div className={styles.empty}>No tasks with due dates</div>
        ) : (
          dated.map((task) => {
            const { left, width } = getBar(task);
            const todayOffset =
              differenceInDays(today, rangeStart) * CELL_WIDTH;

            return (
              <div key={task._id} className={styles.row}>
                <div className={styles.labelCol}>
                  <span className={styles.taskName}>{task.title}</span>
                </div>
                <div className={styles.grid} style={{ position: "relative" }}>
                  {/* Today line */}
                  <div
                    className={styles.todayLine}
                    style={{ left: todayOffset + CELL_WIDTH / 2 }}
                  />
                  {/* Grid cells */}
                  {days.map((d) => (
                    <div
                      key={d.toString()}
                      className={styles.cell}
                      style={{ width: CELL_WIDTH }}
                    />
                  ))}
                  {/* Bar */}
                  <div
                    className={styles.bar}
                    style={{
                      left,
                      width,
                      background: PRIORITY_COLORS[task.priority],
                    }}
                    title={task.title}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TimelineView;
