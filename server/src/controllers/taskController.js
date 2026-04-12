import Task from "../models/Task.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /tasks/search
export const searchTasks = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || !q.trim()) {
      return sendError(res, "Search query 'q' is required", 400);
    }

    const filter = {
      userId: req.userId,
      deletedAt: null,
      $text: { $search: q.trim() },
    };

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limitNum);

    sendSuccess(res, {
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /tasks
export const getTasks = async (req, res) => {
  try {
    const { priority, listId, isCompleted, dueDate, page, limit } = req.query;
    const filter = { userId: req.userId, deletedAt: null }; // Exclude soft-deleted tasks

    if (priority) filter.priority = parseInt(priority);
    if (listId) filter.listId = listId;
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === "true";
    if (dueDate) {
      const date = new Date(dueDate);
      filter.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    // Pagination support
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 0; // 0 = no limit (backward compatible)
    
    if (limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      const total = await Task.countDocuments(filter);
      const tasks = await Task.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limitNum);
      
      sendSuccess(res, {
        tasks,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      });
    } else {
      // No pagination (backward compatible)
      const tasks = await Task.find(filter).sort({ order: 1, createdAt: -1 });
      sendSuccess(res, tasks);
    }
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
      priority,
      dueDate,
      dueTime,
      listId,
      tags,
      subtasks,
      attachments,
    } = req.body;

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      priority: priority || 4,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      listId: listId || null,
      tags: tags || [],
      subtasks: subtasks || [],
      attachments: attachments || [],
    });

    sendSuccess(res, task, "Task created", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId, deletedAt: null });
    if (!task) return sendError(res, "Task not found", 404);

    const allowedFields = [
      "title",
      "description",
      "priority",
      "dueDate",
      "dueTime",
      "listId",
      "tags",
      "subtasks",
      "attachments",
      "order",
      "isCompleted",
    ];
    
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    // Set completedAt when task is marked complete
    if (req.body.isCompleted === true && !task.completedAt) {
      task.completedAt = new Date();
    }
    // Clear completedAt when task is unmarked
    if (req.body.isCompleted === false) {
      task.completedAt = null;
    }

    await task.save();
    sendSuccess(res, task, "Task updated");
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id/toggle-complete
export const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId, deletedAt: null });
    if (!task) return sendError(res, "Task not found", 404);

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : null;

    await task.save();
    sendSuccess(res, task, "Task completion toggled");
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id/soft-delete
export const softDelete = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true },
    );
    if (!task) return sendError(res, "Task not found", 404);
    sendSuccess(res, null, "Task moved to trash");
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id/restore
export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true },
    );
    if (!task) return sendError(res, "Task not found", 404);
    sendSuccess(res, null, "Task restored");
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /tasks/:id/status  (quick status update — kanban drag) [DEPRECATED - use updateTask instead]
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // This endpoint is deprecated; redirect to updateTask
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId, deletedAt: null },
      { $set: { status } },
      { new: true },
    );
    if (!task) return sendError(res, "Task not found", 404);
    sendSuccess(res, task, "Status updated");
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /tasks/:id [DEPRECATED - use softDelete instead]
export const deleteTask = async (req, res) => {
  try {
    // For backward compatibility, perform soft delete instead of hard delete
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true },
    );
    if (!task) return sendError(res, "Task not found", 404);
    sendSuccess(res, null, "Task moved to trash");
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

// GET /tasks/today - returns overdue + today tasks
export const getTodayTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get overdue tasks (dueDate < today AND not completed AND not deleted)
    const overdueTasks = await Task.find({
      userId: req.userId,
      deletedAt: null,
      isCompleted: false,
      dueDate: { $lt: today },
    }).sort({ dueDate: 1, priority: 1 });

    // Get today's tasks (dueDate === today AND not deleted)
    const todayTasks = await Task.find({
      userId: req.userId,
      deletedAt: null,
      dueDate: {
        $gte: today,
        $lt: tomorrow,
      },
    }).sort({ priority: 1, order: 1 });

    sendSuccess(res, {
      overdue: overdueTasks,
      today: todayTasks,
    });
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /tasks/next-7-days - returns tasks due within rolling 7-day window
export const getNext7DaysTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next7Days = new Date(today);
    next7Days.setDate(next7Days.getDate() + 7);

    const tasks = await Task.find({
      userId: req.userId,
      deletedAt: null,
      dueDate: {
        $gte: today,
        $lte: next7Days,
      },
    }).sort({ dueDate: 1, priority: 1 });

    // Group by date on backend
    const groupedTasks = {};
    tasks.forEach(task => {
      const dateKey = task.dueDate.toISOString().split('T')[0];
      if (!groupedTasks[dateKey]) {
        groupedTasks[dateKey] = [];
      }
      groupedTasks[dateKey].push(task);
    });

    sendSuccess(res, { groupedTasks, total: tasks.length });
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /tasks/completed - returns all completed tasks
export const getCompletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      isCompleted: true,
      deletedAt: null,
    })
    .sort({ completedAt: -1 });

    sendSuccess(res, tasks);
  } catch (err) {
    sendError(res, err.message);
  }
};

// GET /tasks/trash - returns soft-deleted tasks within 30 days
export const getTrashedTasks = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasks = await Task.find({
      userId: req.userId,
      deletedAt: {
        $gte: thirtyDaysAgo,
        $ne: null,
      },
    })
    .sort({ deletedAt: -1 });

    sendSuccess(res, tasks);
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /tasks/:id/permanent - hard delete from DB
export const permanentDelete = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
      deletedAt: { $ne: null }, // Only allow permanent delete if already in trash
    });

    if (!task) return sendError(res, "Task not found in trash", 404);

    await Task.deleteOne({ _id: task._id });
    sendSuccess(res, null, "Task permanently deleted");
  } catch (err) {
    sendError(res, err.message);
  }
};

// DELETE /tasks/trash/empty - hard delete all trashed tasks
export const emptyTrash = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Task.deleteMany({
      userId: req.userId,
      deletedAt: { $ne: null },
    });

    sendSuccess(res, null, `Trash emptied: ${result.deletedCount} tasks removed`);
  } catch (err) {
    sendError(res, err.message);
  }
};

// PATCH /tasks/:id/postpone - bulk update dueDate to tomorrow
export const postponeTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
      deletedAt: null,
      isCompleted: false,
    });

    if (!task) return sendError(res, "Task not found", 404);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    task.dueDate = tomorrow;
    await task.save();

    sendSuccess(res, task, "Task postponed to tomorrow");
  } catch (err) {
    sendError(res, err.message);
  }
};
