import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import useTagStore from "@/store/tagStore";
import styles from "./TagPicker.module.scss";

const TagPicker = ({ value = [], onChange, onClose }) => {
  const { tags, fetchTags, createTag } = useTagStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (tagId) => {
    const isSelected = value.includes(tagId);
    const newValue = isSelected
      ? value.filter((id) => id !== tagId)
      : [...value, tagId];
    onChange(newValue);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      const newTag = await createTag({
        name: newTagName.trim(),
        color: "#3B5BDB",
      });
      if (newTag) {
        onChange([...value, newTag._id]);
        setNewTagName("");
        setShowCreateInput(false);
      }
    }
  };

  const handleCreateAndClose = async (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      const newTag = await createTag({
        name: newTagName.trim(),
        color: "#3B5BDB",
      });
      if (newTag) {
        onChange([...value, newTag._id]);
        if (onClose) onClose();
      }
    }
  };

  return (
    <div className={styles.tagPicker}>
      <div className={styles.header}>
        <span className={styles.title}>Tags</span>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search / Create Input */}
      {showCreateInput ? (
        <form className={styles.createForm} onSubmit={handleCreate}>
          <input
            type="text"
            className={styles.createInput}
            placeholder="Tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            autoFocus
          />
          <button type="submit" className={styles.createBtn}>
            Create
          </button>
        </form>
      ) : (
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search or create tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                handleCreateAndClose(e);
              }
            }}
          />
          <button
            className={styles.addTagBtn}
            onClick={() => setShowCreateInput(true)}
            title="Create new tag"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      {/* Tags List */}
      <div className={styles.tagsList}>
        {filteredTags.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tags yet</p>
            <span>Type to create new tags</span>
          </div>
        ) : (
          filteredTags.map((tag) => {
            const isSelected = value.includes(tag._id);
            return (
              <button
                key={tag._id}
                className={`${styles.tagItem} ${isSelected ? styles.selected : ""}`}
                onClick={() => handleToggle(tag._id)}
              >
                <span
                  className={styles.tagDot}
                  style={{ backgroundColor: tag.color }}
                />
                <span className={styles.tagName}>{tag.name}</span>
                {tag.taskCount !== undefined && (
                  <span className={styles.tagCount}>{tag.taskCount}</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TagPicker;
