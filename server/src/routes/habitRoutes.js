import express from "express";
import {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCheckIn,
  getTodayHabits,
} from "../controllers/habitController.js";
import { setLogNote, getHabitStats } from "../controllers/habitController.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Habit CRUD
router.get("/", getHabits);
router.get("/today", getTodayHabits);
router.get("/:id", getHabit);
router.post("/", createHabit);
router.patch("/:id", updateHabit);
router.delete("/:id", deleteHabit);

// Habit check-in
router.post("/:id/check-in", toggleCheckIn);

// Habit stats
router.get("/:id/stats", getHabitStats);

// Habit log operations
router.patch("/logs/:id/note", setLogNote);

export default router;
