import express from 'express';
import requireAuth from '../middleware/auth.js';
import {
  getLists,
  getList,
  createList,
  updateList,
  deleteList,
  seedDefaultLists,
} from '../controllers/listController.js';

const router = express.Router();

router.use(requireAuth); // all list routes protected

router.get('/seed', seedDefaultLists);
router.get('/', getLists);
router.get('/:id', getList);
router.post('/', createList);
router.patch('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
