import express from 'express';
import requireAuth from '../middleware/auth.js';
import {
  getTags,
  getTag,
  createTag,
  deleteTag,
} from '../controllers/tagController.js';

const router = express.Router();

router.use(requireAuth); // all tag routes protected

router.get('/', getTags);
router.get('/:id', getTag);
router.post('/', createTag);
router.delete('/:id', deleteTag);

export default router;
