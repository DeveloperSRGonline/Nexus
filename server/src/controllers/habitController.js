import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /habits - get all habits for user with logs for last 7 days
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId })
      .sort({ section: 1, createdAt: 1 })
      .lean();

    // Get logs for last 7 days for each habit
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const startDateStr = sevenDaysAgo.toISOString().split("T")[0];

    const habitsWithLogs = await Promise.all(
      habits.map(async (habit) => {
        const logs = await HabitLog.find({
          userId: req.userId,
          habitId: habit._id,
          date: { $gte: startDateStr },
        }).lean();

        return { ...habit, logs };
      })
    );

    sendSuccess(res, habitsWithLogs);
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /habits/:id - get a specific habit with logs
export const getHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean();

    if (!habit) return sendError(res, "Habit not found", 404);

    const logs = await HabitLog.find({
      userId: req.userId,
      habitId: habit._id,
    }).lean();

    sendSuccess(res, { ...habit, logs });
  } catch (err) {
    sendError(res, err.message);
  }
};

// POST /habits - create new habit
export const createHabit = async (req, res) => {
  try {
    const {
      name,
      emoji,
      frequency,
      scheduledDays,
      goal,
      startDate,
      goalDays,
      section,
      reminders,
      autoPopLog,
    } = req.body;

    const habit = await Habit.create({
      userId: req.userId,
      name,
      emoji: emoji || "✅",
      frequency: frequency || "daily",
      scheduledDays: scheduledDays || [0, 1, 2, 3, 4, 5, 6],
      goal: goal || "Achieve it all",
      startDate: startDate || new Date(),
      goalDays: goalDays || 0,
      section: section || "Others",
      reminders: reminders || [],
      autoPopLog: autoPopLog || false,
    });

    sendSuccess(res, habit, "Habit created", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /habits/:id - update habit
export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) return sendError(res, "Habit not found", 404);

    const allowedFields = [
      "name",
      "emoji",
      "frequency",
      "scheduledDays",
      "goal",
      "startDate",
      "goalDays",
      "section",
      "reminders",
      "autoPopLog",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        habit[field] = req.body[field];
      }
    });

    await habit.save();
    sendSuccess(res, habit, "Habit updated");
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /habits/:id - soft-delete habit and associated logs
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) return sendError(res, "Habit not found", 404);

    // Delete all associated logs
    await HabitLog.deleteMany({
      userId: req.userId,
      habitId: habit._id,
    });

    await habit.deleteOne();
    sendSuccess(res, null, "Habit deleted");
  } catch (err) {
    sendError(res, err.message);
  }
};

// POST /habits/:id/check-in - toggle check-in for a specific date
export const toggleCheckIn = async (req, res) => {
  try {
    const { date } = req.body; // YYYY-MM-DD format

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return sendError(res, "Invalid date format. Use YYYY-MM-DD", 400);
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) return sendError(res, "Habit not found", 404);

    // Upsert logic: if log exists, toggle; else create
    let habitLog = await HabitLog.findOne({
      userId: req.userId,
      habitId: habit._id,
      date,
    });

    if (habitLog) {
      // Toggle existing
      habitLog.completed = !habitLog.completed;
      await habitLog.save();
      sendSuccess(res, habitLog, habitLog.completed ? "Habit checked in" : "Habit unchecked");
    } else {
      // Create new
      habitLog = await HabitLog.create({
        userId: req.userId,
        habitId: habit._id,
        date,
        completed: true,
      });
      sendSuccess(res, habitLog, "Habit checked in", 201);
    }
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /habit-logs/:id/note - save journal note for a habit log
export const setLogNote = async (req, res) => {
  try {
    const { note } = req.body;

    const habitLog = await HabitLog.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habitLog) return sendError(res, "Habit log not found", 404);

    habitLog.logNote = note || "";
    await habitLog.save();
    sendSuccess(res, habitLog, "Note saved");
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /habits/:id/stats - calculate habit statistics
export const getHabitStats = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) return sendError(res, "Habit not found", 404);

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayStr = firstDayOfMonth.toISOString().split("T")[0];

    // Get all logs for this habit
    const allLogs = await HabitLog.find({
      userId: req.userId,
      habitId: habit._id,
    }).lean();

    // Calculate streak: consecutive days from today backwards
    let streak = 0;
    const checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      const log = allLogs.find((l) => l.date === dateStr && l.completed);
      
      if (log) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Check if today has no log yet (don't break streak)
        if (dateStr === todayStr && !log) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    // Calculate monthly stats
    const monthlyLogs = allLogs.filter((log) => log.date >= firstDayStr);
    const monthlyCheckIns = monthlyLogs.filter((log) => log.completed).length;
    
    // Calculate scheduled days in current month up to today
    const daysInMonth = today.getDate();
    let scheduledDaysCount = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const dayOfWeek = date.getDay();
      
      if (habit.scheduledDays.includes(dayOfWeek)) {
        scheduledDaysCount++;
      }
    }

    const checkInRate = scheduledDaysCount > 0 
      ? Math.round((monthlyCheckIns / scheduledDaysCount) * 100) 
      : 0;

    // Total check-ins (all-time)
    const totalCheckIns = allLogs.filter((log) => log.completed).length;

    sendSuccess(res, {
      streak,
      monthlyCheckIns,
      totalCheckIns,
      checkInRate,
      scheduledDaysCount,
    });
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /habits/today - get habits scheduled for today (for Today view)
export const getTodayHabits = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.getDay();

    // Get habits scheduled for today
    const habits = await Habit.find({
      userId: req.userId,
      scheduledDays: dayOfWeek,
    }).lean();

    // Get logs for today
    const habitsWithLogs = await Promise.all(
      habits.map(async (habit) => {
        const log = await HabitLog.findOne({
          userId: req.userId,
          habitId: habit._id,
          date: todayStr,
        }).lean();

        return { ...habit, todayLog: log || null };
      })
    );

    sendSuccess(res, habitsWithLogs);
  } catch (err) {
    sendError(res, err.message);
  }
};
