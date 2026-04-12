import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 4,
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      default: null,
    },
    tags: { type: [String], default: [] },
    subtasks: {
      type: [
        {
          title: { type: String, required: true },
          isCompleted: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

// Index for efficient queries
templateSchema.index({ userId: 1, name: 1 });

const Template = mongoose.model("Template", templateSchema);
export default Template;
