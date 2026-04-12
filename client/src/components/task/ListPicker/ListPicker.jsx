import { useState, useEffect } from "react";
import { Check, Plus } from "lucide-react";
import useListStore from "@/store/listStore";
import styles from "./ListPicker.module.scss";

const ListPicker = ({ value = null, onChange, onClose }) => {
  const { lists, fetchLists, createList } = useListStore();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleSelect = (listId) => {
    onChange(listId);
    if (onClose) onClose();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList = await createList({
        name: newListName.trim(),
        emoji: "📋",
        color: "#3B5BDB",
      });
      if (newList) {
        onChange(newList._id);
        setNewListName("");
        setShowCreateInput(false);
        if (onClose) onClose();
      }
    }
  };

  return (
    <div className={styles.listPicker}>
      <div className={styles.header}>
        <span className={styles.title}>Select List</span>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className={styles.list}>
        {lists.map((list) => {
          const isSelected = value === list._id;
          return (
            <button
              key={list._id}
              className={`${styles.listItem} ${isSelected ? styles.selected : ""}`}
              onClick={() => handleSelect(list._id)}
            >
              <span className={styles.emoji}>{list.emoji}</span>
              <span
                className={styles.colorDot}
                style={{ backgroundColor: list.color }}
              />
              <span className={styles.name}>{list.name}</span>
              {isSelected && (
                <Check size={16} className={styles.checkmark} />
              )}
            </button>
          );
        })}
      </div>

      {showCreateInput ? (
        <form className={styles.createForm} onSubmit={handleCreate}>
          <input
            type="text"
            className={styles.createInput}
            placeholder="List name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            autoFocus
          />
          <button type="submit" className={styles.createBtn}>
            Create
          </button>
        </form>
      ) : (
        <button
          className={styles.createButton}
          onClick={() => setShowCreateInput(true)}
        >
          <Plus size={14} />
          Create new list
        </button>
      )}
    </div>
  );
};

export default ListPicker;
