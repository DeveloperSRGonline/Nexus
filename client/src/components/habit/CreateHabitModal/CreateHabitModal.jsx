import { useState } from "react";
import { X, Save } from "lucide-react";
import DayPicker from "../DayPicker/DayPicker";
import ReminderPicker from "../ReminderPicker/ReminderPicker";
import useHabitStore from "@/store/habitStore";
import styles from "./CreateHabitModal.module.scss";

const EMOJI_OPTIONS = [
  "✅", "🎯", "💪", "📚", "🧘", "🏃", "💧", "🥗",
  "😴", "🧠", "✍️", "🎨", "🎵", "📷", "🌅", "🌙",
];

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

const GOAL_OPTIONS = [
  { value: "Achieve it all", label: "Achieve it all" },
  { value: "Don't break the chain", label: "Don't break the chain" },
  { value: "Track only", label: "Track only" },
];

const SECTION_OPTIONS = [
  { value: "Morning", label: "🌅 Morning" },
  { value: "Afternoon", label: "☀️ Afternoon" },
  { value: "Night", label: "🌙 Night" },
  { value: "Others", label: "📋 Others" },
];

const GOAL_DAYS_OPTIONS = [
  { value: 0, label: "Forever" },
  { value: 7, label: "7 days" },
  { value: 21, label: "21 days" },
  { value: 30, label: "30 days" },
  { value: 100, label: "100 days" },
  { value: 365, label: "365 days" },
];

const CreateHabitModal = ({ onClose, onCreated }) => {
  const { createHabit } = useHabitStore();
  
  const [formData, setFormData] = useState({
    name: "",
    emoji: "✅",
    frequency: "daily",
    scheduledDays: [0, 1, 2, 3, 4, 5, 6],
    goal: "Achieve it all",
    startDate: new Date().toISOString().split("T")[0],
    goalDays: 0,
    section: "Others",
    reminders: [],
    autoPopLog: false,
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      await createHabit(formData);
      onCreated();
    } catch (err) {
      console.error("Failed to create habit:", err);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmojiSelect = (emoji) => {
    updateField("emoji", emoji);
    setShowEmojiPicker(false);
  };

  const handleScheduledDaysChange = (days) => {
    updateField("scheduledDays", days);
  };

  const handleRemindersChange = (reminders) => {
    updateField("reminders", reminders);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Habit</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Emoji & Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Habit</label>
            <div className={styles.emojiNameRow}>
              <div
                className={styles.emojiButton}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {formData.emoji}
              </div>
              <input
                type="text"
                className={styles.nameInput}
                placeholder="Enter habit name..."
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                autoFocus
              />
            </div>

            {showEmojiPicker && (
              <div className={styles.emojiPicker}>
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={styles.emojiOption}
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Frequency */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Frequency</label>
            <select
              className={styles.select}
              value={formData.frequency}
              onChange={(e) => updateField("frequency", e.target.value)}
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {formData.frequency !== "daily" && (
              <div className={styles.dayPickerWrapper}>
                <button
                  type="button"
                  className={styles.dayPickerButton}
                  onClick={() => setShowDayPicker(!showDayPicker)}
                >
                  {formData.scheduledDays.length === 7
                    ? "Every day"
                    : `${formData.scheduledDays.length} days selected`}
                </button>
                {showDayPicker && (
                  <DayPicker
                    selectedDays={formData.scheduledDays}
                    onChange={handleScheduledDaysChange}
                    onClose={() => setShowDayPicker(false)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Goal */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Goal</label>
            <select
              className={styles.select}
              value={formData.goal}
              onChange={(e) => updateField("goal", e.target.value)}
            >
              {GOAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Start Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={formData.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />
          </div>

          {/* Goal Days */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Duration</label>
            <select
              className={styles.select}
              value={formData.goalDays}
              onChange={(e) => updateField("goalDays", Number(e.target.value))}
            >
              {GOAL_DAYS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Section</label>
            <div className={styles.sectionGrid}>
              {SECTION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.sectionButton} ${
                    formData.section === opt.value ? styles.active : ""
                  }`}
                  onClick={() => updateField("section", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Reminders</label>
            <div className={styles.remindersRow}>
              <button
                type="button"
                className={styles.reminderAddButton}
                onClick={() => setShowReminderPicker(!showReminderPicker)}
              >
                + Add Reminder
              </button>
              {formData.reminders.length > 0 && (
                <div className={styles.reminderChips}>
                  {formData.reminders.map((time, index) => (
                    <span key={index} className={styles.reminderChip}>
                      {time}
                      <button
                        type="button"
                        className={styles.removeChip}
                        onClick={() => {
                          const newReminders = formData.reminders.filter(
                            (_, i) => i !== index
                          );
                          updateField("reminders", newReminders);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {showReminderPicker && (
              <ReminderPicker
                onConfirm={(time) => {
                  updateField("reminders", [...formData.reminders, time]);
                  setShowReminderPicker(false);
                }}
                onClose={() => setShowReminderPicker(false)}
              />
            )}
          </div>

          {/* Auto Pop-up */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.autoPopLog}
                onChange={(e) => updateField("autoPopLog", e.target.checked)}
              />
              <span>Auto pop-up of habit log</span>
            </label>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              <Save size={16} />
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabitModal;
