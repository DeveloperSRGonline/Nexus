import { create } from "zustand";
import habitService from "@/services/habitService";
import toast from "react-hot-toast";

const useHabitStore = create((set, get) => ({
  habits: [],
  selectedHabit: null,
  habitStats: null,
  isLoading: false,
  error: null,

  // ── Fetch All Habits ──────────────────────────────
  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await habitService.getAll();
      set({ habits: res.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load habits");
    }
  },

  // ── Fetch Today's Habits ──────────────────────────
  fetchTodayHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await habitService.getToday();
      set({ todayHabits: res.data.data, isLoading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load today's habits");
    }
  },

  // ── Fetch Single Habit ────────────────────────────
  fetchHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await habitService.getById(id);
      set({ selectedHabit: res.data.data, isLoading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load habit");
    }
  },

  // ── Create Habit ──────────────────────────────────
  createHabit: async (data) => {
    try {
      const res = await habitService.create(data);
      set((s) => ({ habits: [...s.habits, res.data.data] }));
      toast.success("Habit created");
      return res.data.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  },

  // ── Update Habit (optimistic) ─────────────────────
  updateHabit: async (id, updates) => {
    const prev = get().habits;
    set((s) => ({
      habits: s.habits.map((h) => (h._id === id ? { ...h, ...updates } : h)),
    }));
    try {
      const res = await habitService.update(id, updates);
      set((s) => ({
        habits: s.habits.map((h) => (h._id === id ? res.data.data : h)),
        selectedHabit:
          s.selectedHabit?._id === id ? res.data.data : s.selectedHabit,
      }));
      toast.success("Habit updated");
    } catch (err) {
      set({ habits: prev });
      toast.error(err.message);
    }
  },

  // ── Delete Habit (optimistic) ─────────────────────
  deleteHabit: async (id) => {
    const prev = get().habits;
    set((s) => ({ habits: s.habits.filter((h) => h._id !== id) }));
    try {
      await habitService.delete(id);
      toast.success("Habit deleted");
    } catch (err) {
      set({ habits: prev });
      toast.error(err.message);
    }
  },

  // ── Toggle Check-In (optimistic) ──────────────────
  toggleCheckIn: async (habitId, date) => {
    const prevLogs = get().habits.map((h) => ({ ...h, logs: [...h.logs] }));

    set((s) => {
      const updatedHabits = s.habits.map((habit) => {
        if (habit._id !== habitId) return habit;

        const existingLog = habit.logs?.find((log) => log.date === date);

        if (existingLog) {
          // Toggle existing
          const updatedLogs = habit.logs.map((log) =>
            log.date === date ? { ...log, completed: !log.completed } : log
          );
          return { ...habit, logs: updatedLogs };
        } else {
          // Add new
          const newLog = {
            _id: `temp-${Date.now()}`,
            habitId,
            date,
            completed: true,
            logNote: "",
          };
          return { ...habit, logs: [...(habit.logs || []), newLog] };
        }
      });

      return { habits: updatedHabits };
    });

    try {
      const res = await habitService.toggleCheckIn(habitId, date);
      // Update with real data from server
      set((s) => ({
        habits: s.habits.map((habit) => {
          if (habit._id !== habitId) return habit;
          // Refresh logs for this habit
          const updatedHabit = s.habits.find((h) => h._id === habitId);
          return updatedHabit || habit;
        }),
      }));
    } catch (err) {
      // Rollback
      set({ habits: prevLogs });
      toast.error("Failed to update check-in");
    }
  },

  // ── Set Log Note (optimistic) ─────────────────────
  setLogNote: async (logId, note) => {
    const prev = get().habits;

    set((s) => ({
      habits: s.habits.map((habit) => ({
        ...habit,
        logs: habit.logs.map((log) =>
          log._id === logId ? { ...log, logNote: note } : log
        ),
      })),
    }));

    try {
      await habitService.setLogNote(logId, note);
      toast.success("Note saved");
    } catch (err) {
      set({ habits: prev });
      toast.error(err.message);
    }
  },

  // ── Fetch Habit Stats ─────────────────────────────
  fetchHabitStats: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await habitService.getStats(id);
      set({ habitStats: res.data.data, isLoading: false });
      return res.data.data;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      toast.error("Failed to load habit stats");
    }
  },

  // ── Set Selected Habit ────────────────────────────
  setSelectedHabit: (habit) => {
    set({ selectedHabit: habit });
  },

  // ── Local helpers ──────────────────────────────────
  getHabitById: (id) => get().habits.find((h) => h._id === id),
  getHabitsForDate: (date) => {
    const habits = get().habits;
    const dayOfWeek = new Date(date).getDay();
    return habits.filter((h) => h.scheduledDays.includes(dayOfWeek));
  },
}));

export default useHabitStore;
