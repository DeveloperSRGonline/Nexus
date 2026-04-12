import React, { useEffect, useState } from "react";
import { X, MoreHorizontal, Zap } from "lucide-react";
import StatCard from "../StatCard/StatCard";
import CalendarHeatmap from "../CalendarHeatmap/CalendarHeatmap";
import HabitLogSection from "../HabitLogSection/HabitLogSection";
import useHabitStore from "@/store/habitStore";
import styles from "./HabitDetailPanel.module.scss";

const HabitDetailPanel = ({ habit, onClose }) => {
  const { fetchHabitStats, habitStats } = useHabitStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit?._id) {
      setLoading(true);
      fetchHabitStats(habit._id).finally(() => setLoading(false));
    }
  }, [habit?._id, fetchHabitStats]);

  if (!habit) return null;

  return (
    <div className={styles.panelOverlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.habitEmoji}>{habit.emoji}</span>
            <h2 className={styles.habitName}>{habit.name}</h2>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconButton} aria-label="Options">
              <MoreHorizontal size={20} />
            </button>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close panel">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {loading ? (
              <>
                <div className={styles.statSkeleton} />
                <div className={styles.statSkeleton} />
                <div className={styles.statSkeleton} />
                <div className={styles.statSkeleton} />
              </>
            ) : (
              <>
                <StatCard
                  icon="📅"
                  value={habitStats?.monthlyCheckIns || 0}
                  label="Monthly Check-ins"
                  color="#3B5BDB"
                />
                <StatCard
                  icon="✅"
                  value={habitStats?.totalCheckIns || 0}
                  label="Total Check-ins"
                  color="#30D15A"
                />
                <StatCard
                  icon="📊"
                  value={`${habitStats?.checkInRate || 0}%`}
                  label="Check-in Rate"
                  color="#FF9F0A"
                />
                <StatCard
                  icon={<Zap size={24} />}
                  value={habitStats?.streak || 0}
                  label="Streak"
                  color="#FF3B30"
                />
              </>
            )}
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className={styles.heatmapSection}>
          <CalendarHeatmap logs={habit.logs || []} habitId={habit._id} />
        </div>

        {/* Habit Log */}
        <div className={styles.logSection}>
          <HabitLogSection logs={habit.logs || []} />
        </div>
      </div>
    </div>
  );
};

export default HabitDetailPanel;
