import { PRIORITY_COLORS } from "@/constants/priority";
import "./TaskPriorityBadge.module.scss";

const TaskPriorityBadge = ({ priority, size = "md", showLabel = false }) => {
  const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS[4];
  
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const circleSize = sizeMap[size] || sizeMap.md;
  
  return (
    <div
      className="task-priority-badge"
      style={{
        width: `${circleSize}px`,
        height: `${circleSize}px`,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        backgroundColor: "transparent",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      aria-label={`Priority ${priority}`}
      title={`Priority P${priority}`}
    >
      {showLabel && (
        <span
          style={{
            fontSize: circleSize * 0.5,
            fontWeight: 600,
            color: color,
          }}
        >
          P{priority}
        </span>
      )}
    </div>
  );
};

export default TaskPriorityBadge;
