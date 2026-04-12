import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const taskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      default: null,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    isCompleted: { type: Boolean, default: false, index: true },
    completedAt: { type: Date, default: null },
    
    priority: {
      type: Number,
      enum: [1, 2, 3, 4], // P1 (highest) to P4 (lowest)
      default: 4,
      index: true,
    },

    dueDate: { type: Date, default: null },
    dueTime: { type: String, default: null }, // HH:MM format

    tags: { type: [String], default: [] },
    subtasks: { type: [subtaskSchema], default: [] },
    attachments: { type: [String], default: [] }, // URLs or file paths

    deletedAt: { type: Date, default: null, index: true }, // for soft delete/trash

    order: { type: Number, default: 0 }, // for manual reorder
  },
  { timestamps: true },
);

// Text index for search
taskSchema.index({ title: "text", description: "text", tags: "text" });

// Index for efficient querying of non-deleted tasks
taskSchema.index({ userId: 1, deletedAt: 1 });
taskSchema.index({ userId: 1, listId: 1, isCompleted: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
