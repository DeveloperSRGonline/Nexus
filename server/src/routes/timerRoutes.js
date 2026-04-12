import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getTimers,
  getTimerById,
  createTimer,
  updateTimer,
  deleteTimer,
} from '../controllers/timerController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Timer routes
router.get('/', getTimers);
router.post('/', createTimer);
router.get('/:id', getTimerById);
router.patch('/:id', updateTimer);
router.delete('/:id', deleteTimer);

export default router;
