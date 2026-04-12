import express from 'express';
import requireAuth from '../middleware/auth.js';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController.js';

const router = express.Router();

router.use(requireAuth); // all template routes protected

// Standard CRUD
router.get('/', getTemplates);
router.get('/:id', getTemplate);
router.post('/', createTemplate);
router.patch('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
