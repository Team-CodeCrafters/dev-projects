import { Router } from 'express';
import { authenticateUser } from '../middleware/userValidation.js';
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
} from '../controllers/commentController.js';

const router = Router();

router.post('/new', authenticateUser, createComment);
router.get('/:id', getComments);
router.put('/edit', authenticateUser, editComment);
router.delete('/', authenticateUser, deleteComment);

export default router;
