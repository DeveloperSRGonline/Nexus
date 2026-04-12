import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import HabitRowCard from "@/components/habit/HabitRowCard/HabitRowCard";
import CreateHabitModal from "@/components/habit/CreateHabitModal/CreateHabitModal";
import HabitDetailPanel from "@/components/habit/HabitDetailPanel/HabitDetailPanel";
import useHabitStore from "@/store/habitStore";
import styles from "./Habits.module.scss";

const Habits = () => {
  const { habits, fetchHabits } = useHabitStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleOpenDetail = (habit) => {
    setSelectedHabit(habit);
  };

  const handleCloseDetail = () => {
    setSelectedHabit(null);
  };

  const handleHabitCreated = () => {
    setShowCreateModal(false);
    fetchHabits();
  };

  // Calculate 7-day rolling header
  const sevenDays = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateNum = date.getDate();
    const isToday = i === 0;
    
    sevenDays.push({
      date: dateStr,
      dayName,
      dateNum,
      isToday,
    });
  }

  // Group habits by section
  const groupedHabits = habits.reduce((acc, habit) => {
    const section = habit.section || "Others";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(habit);
    return acc;
  }, {});

  return (
    <div className={styles.habitsPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Habit</h1>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new habit"
        >
          <Plus size={20} />
        </button>
      </header>

      {/* 7-Day Rolling Header */}
      <div className={styles.weekHeader}>
        <div className={styles.habitNameColumn}></div>
        <div className={styles.daysRow}>
          {sevenDays.map((day) => (
            <div
              key={day.date}
              className={`${styles.dayColumn} ${day.isToday ? styles.today : ""}`}
            >
              <span className={styles.dayName}>{day.dayName}</span>
              <span className={styles.dayNumber}>{day.dateNum}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Habits List grouped by Section */}
      <div className={styles.habitsList}>
        {Object.keys(groupedHabits).length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎯</div>
            <h3>No habits yet</h3>
            <p>Create your first daily routine to start tracking!</p>
            <button
              className={styles.createButton}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} />
              Create First Habit
            </button>
          </div>
        ) : (
          Object.keys(groupedHabits)
            .sort()
            .map((section) => (
              <div key={section} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section}</h2>
                <div className={styles.sectionHabits}>
                  {groupedHabits[section].map((habit) => (
                    <HabitRowCard
                      key={habit._id}
                      habit={habit}
                      onOpenDetail={handleOpenDetail}
                    />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Create Habit Modal */}
      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleHabitCreated}
        />
      )}

      {/* Habit Detail Panel */}
      {selectedHabit && (
        <HabitDetailPanel
          habit={selectedHabit}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default Habits;
