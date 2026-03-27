import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const activitySchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'created', 'status_changed', 'completed', etc.
  detail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done", "cancelled"],
      default: "todo",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },

    dueDate: { type: Date, default: null },
    startDate: { type: Date, default: null },

    tags: { type: [String], default: [] },
    subtasks: { type: [subtaskSchema], default: [] },

    activityLog: { type: [activitySchema], default: [] },

    order: { type: Number, default: 0 }, // for manual reorder
  },
  { timestamps: true },
);

// Text index for search
taskSchema.index({ title: "text", description: "text", tags: "text" });

const Task = mongoose.model("Task", taskSchema);
export default Task;
