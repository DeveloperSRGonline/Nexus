import { useState } from "react";
import { Plus, Calendar, Flag, List, Tag, X } from "lucide-react";
import { format } from "date-fns";
import PriorityPicker from "../PriorityPicker/PriorityPicker";
import ListPicker from "../ListPicker/ListPicker";
import TagPicker from "../TagPicker/TagPicker";
import useTaskStore from "@/store/taskStore";
import styles from "./TaskInput.module.scss";

const TaskInput = ({ placeholder = "Add a task...", defaultListId = null }) => {
  const { createTask } = useTaskStore();
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // 'priority', 'date', 'list', or 'tag'
  
  // Task data state
  const [priority, setPriority] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [selectedListId, setSelectedListId] = useState(defaultListId);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.trim()) {
      const taskData = {
        title: value.trim(),
        priority: priority || 4,
        dueDate: dueDate || null,
        listId: selectedListId || null,
        tags: selectedTags,
      };
      
      try {
        await createTask(taskData);
        // Reset form
        setValue("");
        setPriority(null);
        setDueDate(null);
        setSelectedListId(defaultListId);
        setSelectedTags([]);
        setExpanded(false);
        setActivePicker(null);
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    }
  };

  const closeAllPickers = () => setActivePicker(null);

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    closeAllPickers();
  };

  const handleListChange = (newListId) => {
    setSelectedListId(newListId);
    closeAllPickers();
  };

  const handleTagsChange = (newTags) => {
    setSelectedTags(newTags);
  };

  const clearDate = () => setDueDate(null);
  const clearList = () => setSelectedListId(defaultListId);
  const clearTags = () => setSelectedTags([]);

  return (
    <div className={styles.taskInputWrapper}>
      <form className={styles.taskInput} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setExpanded(true)}
        />
        <button type="submit" className={styles.addButton}>
          <Plus size={18} />
        </button>
      </form>

      {/* Expanded toolbar */}
      {expanded && (
        <>
          <div className={styles.toolbar}>
            <button
              className={`${styles.toolbarBtn} ${priority ? styles.active : ""}`}
              onClick={() => setActivePicker(activePicker === "priority" ? null : "priority")}
            >
              <Flag size={16} />
              {priority && <span className={styles.badge}>P{priority}</span>}
              Priority
            </button>

            <button
              className={`${styles.toolbarBtn} ${dueDate ? styles.active : ""}`}
              onClick={() => setActivePicker(activePicker === "date" ? null : "date")}
            >
              <Calendar size={16} />
              {dueDate && format(new Date(dueDate), "MMM d")}
              {!dueDate && "Date"}
            </button>

            <button
              className={`${styles.toolbarBtn} ${selectedListId ? styles.active : ""}`}
              onClick={() => setActivePicker(activePicker === "list" ? null : "list")}
            >
              <List size={16} />
              List
            </button>

            <button
              className={`${styles.toolbarBtn} ${selectedTags.length > 0 ? styles.active : ""}`}
              onClick={() => setActivePicker(activePicker === "tag" ? null : "tag")}
            >
              <Tag size={16} />
              {selectedTags.length > 0 && (
                <span className={styles.badge}>{selectedTags.length}</span>
              )}
              Tags
            </button>
          </div>

          {/* Clear selections row */}
          {(priority || dueDate || selectedListId || selectedTags.length > 0) && (
            <div className={styles.selections}>
              {priority && (
                <span className={styles.selectionChip} style={{ borderColor: `var(--priority-${priority})` }}>
                  P{priority}
                  <button type="button" onClick={() => setPriority(null)}><X size={12} /></button>
                </span>
              )}
              {dueDate && (
                <span className={styles.selectionChip}>
                  {format(new Date(dueDate), "MMM d, yyyy")}
                  <button type="button" onClick={clearDate}><X size={12} /></button>
                </span>
              )}
              {selectedListId && (
                <span className={styles.selectionChip}>
                  List selected
                  <button type="button" onClick={clearList}><X size={12} /></button>
                </span>
              )}
              {selectedTags.length > 0 && (
                <span className={styles.selectionChip}>
                  {selectedTags.length} tag(s)
                  <button type="button" onClick={clearTags}><X size={12} /></button>
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* Priority Picker */}
      {activePicker === "priority" && (
        <div className={styles.pickerDropdown}>
          <PriorityPicker
            value={priority}
            onChange={handlePriorityChange}
            onClose={closeAllPickers}
          />
        </div>
      )}

      {/* List Picker */}
      {activePicker === "list" && (
        <div className={styles.pickerDropdown}>
          <ListPicker
            value={selectedListId}
            onChange={handleListChange}
            onClose={closeAllPickers}
          />
        </div>
      )}

      {/* Tag Picker */}
      {activePicker === "tag" && (
        <div className={styles.pickerDropdown}>
          <TagPicker
            value={selectedTags}
            onChange={handleTagsChange}
            onClose={closeAllPickers}
          />
        </div>
      )}

      {/* Date Picker (Simple) */}
      {activePicker === "date" && (
        <div className={styles.pickerDropdown}>
          <div className={styles.simpleDatePicker}>
            <div className={styles.datePickerHeader}>
              <span>Select Date</span>
              <button onClick={closeAllPickers}><X size={14} /></button>
            </div>
            <input
              type="date"
              className={styles.dateInput}
              value={dueDate ? format(new Date(dueDate), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                setDueDate(e.target.value ? new Date(e.target.value) : null);
                closeAllPickers();
              }}
              min={format(new Date(), "yyyy-MM-dd")}
              autoFocus
            />
            <div className={styles.dateQuickOptions}>
              <button
                type="button"
                className={styles.quickDateBtn}
                onClick={() => {
                  const today = new Date();
                  setDueDate(today);
                  closeAllPickers();
                }}
              >
                Today
              </button>
              <button
                type="button"
                className={styles.quickDateBtn}
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDueDate(tomorrow);
                  closeAllPickers();
                }}
              >
                Tomorrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInput;
