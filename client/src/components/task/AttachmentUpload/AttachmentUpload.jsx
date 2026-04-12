import { useState, useRef } from "react";
import { Upload, X, File, FileText, Image, Paperclip } from "lucide-react";
import useTaskStore from "@/store/taskStore";
import styles from "./AttachmentUpload.module.scss";

const AttachmentUpload = ({ taskId, attachments = [] }) => {
  const { updateTask } = useTaskStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    // For now, we'll store file names only
    // In production, you would upload files to a storage service
    // and store the URLs in the attachments array
    const fileNames = files.map(file => file.name);
    const updatedAttachments = [...attachments, ...fileNames];

    updateTask(taskId, { attachments: updatedAttachments }).then(() => {
      setIsUploading(false);
    }).catch(() => {
      setIsUploading(false);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAttachment = (idx) => {
    const updatedAttachments = attachments.filter((_, i) => i !== idx);
    updateTask(taskId, { attachments: updatedAttachments });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const docExts = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];

    if (imageExts.includes(ext)) return <Image size={14} />;
    if (docExts.includes(ext)) return <FileText size={14} />;
    return <File size={14} />;
  };

  return (
    <div className={styles.container}>
      {/* File upload area */}
      <div
        className={styles.uploadArea}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          // Handle drag and drop
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            setIsUploading(true);
            const fileNames = files.map(file => file.name);
            const updatedAttachments = [...attachments, ...fileNames];
            updateTask(taskId, { attachments: updatedAttachments }).finally(() => {
              setIsUploading(false);
            });
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          multiple
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.svg,.webp"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className={styles.uploading}>
            <Upload size={20} className={styles.uploadIcon} />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <Upload size={20} className={styles.uploadIcon} />
            <span>Click to upload or drag and drop</span>
            <span className={styles.hint}>PDF, DOC, XLS, PPT, images (max 10MB)</span>
          </div>
        )}
      </div>

      {/* Attached files */}
      {attachments.length > 0 && (
        <div className={styles.attachmentList}>
          {attachments.map((attachment, idx) => (
            <div key={idx} className={styles.attachmentItem}>
              <div className={styles.attachmentChip}>
                {getFileIcon(attachment)}
                <span className={styles.fileName}>{attachment}</span>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemoveAttachment(idx)}
                title="Remove attachment"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUpload;
