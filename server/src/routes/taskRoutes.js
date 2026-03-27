import express from 'express';
import requireAuth from '../middleware/auth.js';
import {
  getTasks, getTask, createTask,
  updateTask, updateTaskStatus,
  deleteTask, updateSubtasks,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(requireAuth); // all task routes protected

router.get   ('/',              getTasks);
router.get   ('/:id',           getTask);
router.post  ('/',              createTask);
router.patch ('/:id',           updateTask);
router.patch ('/:id/status',    updateTaskStatus);
router.patch ('/:id/subtasks',  updateSubtasks);
router.delete('/:id',           deleteTask);

export default router;