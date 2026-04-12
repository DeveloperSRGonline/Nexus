import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD format
    completed: { type: Boolean, default: false },
    logNote: { type: String, default: "" },
  },
  { timestamps: true },
);

// Compound unique index to prevent duplicate logs per habit per date
habitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });
habitLogSchema.index({ userId: 1, date: 1 });

const HabitLog = mongoose.model("HabitLog", habitLogSchema);
export default HabitLog;
