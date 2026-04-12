import mongoose from "mongoose";

const focusRecordSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    timerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timer",
      required: true,
      index: true,
    },
    linkedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    mode: {
      type: String,
      enum: ["pomo", "stopwatch"],
      required: true,
    },
    duration: { type: Number, required: true }, // in seconds
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Index for efficient queries per user
focusRecordSchema.index({ userId: 1, completedAt: 1 });
focusRecordSchema.index({ userId: 1, linkedTaskId: 1 });

const FocusRecord = mongoose.model("FocusRecord", focusRecordSchema);
export default FocusRecord;
