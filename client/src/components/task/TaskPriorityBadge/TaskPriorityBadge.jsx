import Badge from "@/components/ui/Badge/Badge";
import { PRIORITY_LABELS } from "@/constants/priority";

const TaskPriorityBadge = ({ priority, size }) => (
  <Badge variant={priority} size={size}>
    {PRIORITY_LABELS[priority] || priority}
  </Badge>
);

export default TaskPriorityBadge;
