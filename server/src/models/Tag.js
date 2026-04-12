import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // Clerk user ID
    name: { type: String, required: true, trim: true },
    color: { type: String, default: "#3B5BDB" }, // Hex color code
  },
  { timestamps: true },
);

// Compound index for efficient queries per user
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
