import express from 'express';
import requireAuth from '../middleware/auth.js';
import {
  getTasks, getTask, createTask,
  updateTask, updateTaskStatus,
  deleteTask, updateSubtasks,
  toggleComplete, softDelete, restoreTask,
  searchTasks, getTodayTasks, getNext7DaysTasks,
  getCompletedTasks, getTrashedTasks, permanentDelete,
  emptyTrash, postponeTask,
} from '../controllers/taskController.js';
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateStatusUpdate,
} from '../middleware/validateTask.js';

const router = express.Router();

router.use(requireAuth); // all task routes protected

// Search and special queries
router.get   ('/search',         searchTasks);
router.get   ('/today',          getTodayTasks);
router.get   ('/next-7-days',    getNext7DaysTasks);
router.get   ('/completed',      getCompletedTasks);
router.get   ('/trash',          getTrashedTasks);
router.delete('/trash/empty',    emptyTrash);

// Standard CRUD
router.get   ('/',              getTasks);
router.get   ('/:id',           validateTaskId, getTask);
router.post  ('/',              validateCreateTask, createTask);
router.patch ('/:id',           validateTaskId, validateUpdateTask, updateTask);
router.patch ('/:id/toggle-complete', validateTaskId, toggleComplete);
router.patch ('/:id/soft-delete', validateTaskId, softDelete);
router.patch ('/:id/restore',   validateTaskId, restoreTask);
router.patch ('/:id/postpone',  validateTaskId, postponeTask);
router.patch ('/:id/status',    validateTaskId, validateStatusUpdate, updateTaskStatus);
router.patch ('/:id/subtasks',  validateTaskId, updateSubtasks);
router.delete('/:id',           validateTaskId, deleteTask);
router.delete('/:id/permanent', validateTaskId, permanentDelete);

export default router;