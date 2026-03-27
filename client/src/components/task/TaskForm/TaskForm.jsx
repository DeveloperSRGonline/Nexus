import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import useTaskStore from "@/store/taskStore";
import { TASK_STATUS, STATUS_LABELS } from "@/constants/taskStatus";
import { PRIORITY, PRIORITY_LABELS } from "@/constants/priority";
import styles from "./TaskForm.module.scss";

const EMPTY = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  tags: "",
};

const TaskForm = ({ task = null, defaultStatus = null, onClose }) => {
  const { createTask, updateTask } = useTaskStore();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        tags: task.tags?.join(", ") || "",
      });
    } else if (defaultStatus) {
      setForm((f) => ({ ...f, status: defaultStatus }));
    }
  }, [task, defaultStatus]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    try {
      if (task) await updateTask(task._id, payload);
      else await createTask(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3>{task ? "Edit Task" : "New Task"}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <input
            className={styles.titleInput}
            placeholder="Task title..."
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            autoFocus
          />

          <textarea
            className={styles.descInput}
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
          />

          <div className={styles.row}>
            {/* Status */}
            <div className={styles.field}>
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className={styles.field}>
              <label>Priority</label>
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            {/* Due date */}
            <div className={styles.field}>
              <label>Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className={styles.field}>
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="design, backend..."
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={loading} onClick={handleSubmit}>
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
