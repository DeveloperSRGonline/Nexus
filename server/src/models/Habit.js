import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    name: { type: String, required: true, trim: true },
    emoji: { type: String, default: "✅" },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "custom"],
      default: "daily",
    },
    scheduledDays: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6], // 0=Sunday, 6=Saturday (all days by default)
    },
    goal: { type: String, default: "Achieve it all" },
    startDate: { type: Date, default: Date.now },
    goalDays: { type: Number, default: 0 }, // 0 = forever
    section: { type: String, default: "Others" }, // Morning/Afternoon/Night/Others
    reminders: [{ type: String }], // Array of time strings (HH:MM format)
    autoPopLog: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Compound index for efficient queries per user
habitSchema.index({ userId: 1, section: 1, startDate: 1 });

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
