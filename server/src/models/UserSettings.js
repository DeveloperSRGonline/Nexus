import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true, unique: true }, // Clerk user ID (singleton per user)
    defaultPomoMins: { type: Number, default: 25 },
    breakMins: { type: Number, default: 5 },
    autoStartBreak: { type: Boolean, default: false },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Index for efficient queries
userSettingsSchema.index({ userId: 1 });

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
export default UserSettings;
