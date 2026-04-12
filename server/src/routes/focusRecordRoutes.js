import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getOverview,
  getFocusRecords,
  createFocusRecord,
  deleteFocusRecord,
} from '../controllers/focusRecordController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Focus record routes (special routes before /:id to avoid conflicts)
router.get('/overview', getOverview);
router.get('/', getFocusRecords);
router.post('/', createFocusRecord);
router.delete('/:id', deleteFocusRecord);

export default router;
