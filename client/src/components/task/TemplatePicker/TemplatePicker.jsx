import { useState, useEffect } from "react";
import { X, Plus, FileText } from "lucide-react";
import useTemplateStore from "@/store/templateStore";
import styles from "./TemplatePicker.module.scss";

const TemplatePicker = ({ onSelect, onClose }) => {
  const { templates, fetchTemplates, isLoading } = useTemplateStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemplate = (template) => {
    onSelect?.(template);
    onClose?.();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Choose a Template</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Loading templates...</div>
          ) : filteredTemplates.length === 0 ? (
            <div className={styles.emptyState}>
              <FileText size={48} className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                {searchQuery ? "No templates found" : "No templates yet"}
              </p>
              {!searchQuery && (
                <p className={styles.emptyHint}>
                  Create a template from any task to get started
                </p>
              )}
            </div>
          ) : (
            <div className={styles.templateList}>
              {filteredTemplates.map((template) => (
                <button
                  key={template._id}
                  className={styles.templateCard}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className={styles.templateIcon}>
                    <FileText size={20} />
                  </div>
                  <div className={styles.templateInfo}>
                    <h3 className={styles.templateName}>{template.name}</h3>
                    <p className={styles.templateMeta}>
                      P{template.priority} • {template.tags?.length || 0} tags •{" "}
                      {template.subtasks?.length || 0} subtasks
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatePicker;
