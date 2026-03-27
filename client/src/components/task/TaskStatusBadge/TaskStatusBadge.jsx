import Badge from "@/components/ui/Badge/Badge";
import { STATUS_LABELS } from "@/constants/taskStatus";

const TaskStatusBadge = ({ status, size }) => (
  <Badge variant={status} size={size} dot>
    {STATUS_LABELS[status] || status}
  </Badge>
);

export default TaskStatusBadge;
