import Task from "../models/Task.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /tasks
export const getTasks = async (req, res) => {
  try {
    const { status, priority, projectId, dueDate } = req.query;
    const filter = { userId: req.userId };

    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (projectId) filter.projectId = projectId;
    if (dueDate) {
      const date = new Date(dueDate);
      filter.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    const tasks = await Task.find(filter).sort({ order: 1, createdAt: -1 });
    sendSuccess(res, tasks);
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /tasks/:id
export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return sendError(res, "Task not found", 404);
    sendSuccess(res, task);
  } catch (err) {
    sendError(res, err.message);
  }
};

// POST /tasks
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      startDate,
      projectId,
      tags,
    } = req.body;

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate || null,
      startDate: startDate || null,
      projectId: projectId || null,
      tags: tags || [],
      activityLog: [{ action: "created", detail: `Task created` }],
    });

    sendSuccess(res, task, "Task created", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return sendError(res, "Task not found", 404);

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "dueDate",
      "startDate",
      "projectId",
      "tags",
      "order",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    // Log activity
    if (req.body.status && req.body.status !== task.status) {
      task.activityLog.push({
        action: "status_changed",
        detail: `Status → ${req.body.status}`,
      });
    }

    await task.save();
    sendSuccess(res, task, "Task updated");
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id/status  (quick status update — kanban drag)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        $set: { status },
        $push: {
          activityLog: {
            action: "status_changed",
            detail: `Status → ${status}`,
          },
        },
      },
      { new: true },
    );
    if (!task) return sendError(res, "Task not found", 404);
    sendSuccess(res, task, "Status updated");
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!task) return sendError(res, "Task not found", 404);
    sendSuccess(res, null, "Task deleted");
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id/subtasks
export const updateSubtasks = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return sendError(res, "Task not found", 404);
    task.subtasks = req.body.subtasks;
    await task.save();
    sendSuccess(res, task, "Subtasks updated");
  } catch (err) {
    sendError(res, err.message);
  }
};
