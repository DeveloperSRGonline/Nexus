import { TASK_STATUS } from "@/constants/taskStatus";
import { PRIORITY_ORDER } from "@/constants/priority";

export const groupByStatus = (tasks) => {
  const groups = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
    cancelled: [],
  };
  tasks.forEach((t) => {
    if (groups[t.status]) groups[t.status].push(t);
  });
  return groups;
};

export const sortByPriority = (tasks) =>
  [...tasks].sort(
    (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
  );

export const filterTasks = (tasks, filters) =>
  tasks.filter((t) => {
    if (
      filters.status &&
      filters.status !== "all" &&
      t.status !== filters.status
    )
      return false;
    if (
      filters.priority &&
      filters.priority !== "all" &&
      t.priority !== filters.priority
    )
      return false;
    if (filters.project && t.projectId?.toString() !== filters.project)
      return false;
    return true;
  });
