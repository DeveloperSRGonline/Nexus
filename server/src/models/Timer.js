import mongoose from "mongoose";

const timerSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    name: { type: String, required: true, trim: true },
    emoji: { type: String, default: "⏱️" },
    mode: {
      type: String,
      enum: ["pomo", "stopwatch"],
      default: "pomo",
    },
    pomoDuration: { type: Number, default: 25 }, // in minutes
  },
  { timestamps: true },
);

// Index for efficient queries per user
timerSchema.index({ userId: 1 });

const Timer = mongoose.model("Timer", timerSchema);
export default Timer;
