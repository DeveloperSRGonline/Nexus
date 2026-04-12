import { useState } from "react";
import { X, FileText, Tag, Paperclip, Check } from "lucide-react";
import SubtaskList from "../SubtaskList/SubtaskList";
import AttachmentUpload from "../AttachmentUpload/AttachmentUpload";
import styles from "./TaskDetailPanel.module.scss";

const TaskDetailPanel = ({ task, onClose }) => {
  const [activeTab, setActiveTab] = useState("subtasks");

  if (!task) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Task Details</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Task info */}
        <div className={styles.taskInfo}>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}
          <div className={styles.meta}>
            {task.dueDate && (
              <span className={styles.metaItem}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.priority && (
              <span className={styles.metaItem}>Priority: P{task.priority}</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "subtasks" ? styles.active : ""}`}
            onClick={() => setActiveTab("subtasks")}
          >
            <Check size={14} />
            <span>Subtasks</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "attachments" ? styles.active : ""}`}
            onClick={() => setActiveTab("attachments")}
          >
            <Paperclip size={14} />
            <span>Attachments</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === "tags" ? styles.active : ""}`}
            onClick={() => setActiveTab("tags")}
          >
            <Tag size={14} />
            <span>Tags</span>
          </button>
        </div>

        {/* Tab content */}
        <div className={styles.content}>
          {activeTab === "subtasks" && (
            <SubtaskList taskId={task._id} subtasks={task.subtasks} />
          )}
          {activeTab === "attachments" && (
            <AttachmentUpload taskId={task._id} attachments={task.attachments} />
          )}
          {activeTab === "tags" && (
            <div className={styles.tagsContent}>
              {task.tags && task.tags.length > 0 ? (
                <div className={styles.tagList}>
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className={styles.tagChip}>{tag}</span>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Tag size={32} className={styles.emptyIcon} />
                  <p>No tags added yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;
