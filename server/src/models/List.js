import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    name: { type: String, required: true, trim: true },
    emoji: { type: String, default: "📋" },
    color: { type: String, default: "#3B5BDB" }, // Hex color code
    sortOrder: { type: Number, default: 0 }, // for manual reorder
    isSystem: { type: Boolean, default: false }, // system lists (e.g., Inbox) cannot be deleted
  },
  { timestamps: true },
);

// Compound index for efficient queries per user
listSchema.index({ userId: 1, sortOrder: 1 });
listSchema.index({ userId: 1, isSystem: 1 });

const List = mongoose.model("List", listSchema);
export default List;
