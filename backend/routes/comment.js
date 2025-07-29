import { Router } from 'express';
import { authenticateUser } from '../middleware/userValidation.js';
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getUserVotes,
  voteComment,
} from '../controllers/commentController.js';

const router = Router();

router.post('/new', authenticateUser, createComment);
router.post('/vote', authenticateUser, voteComment);
router.get('/user-votes', authenticateUser, getUserVotes);
router.get('/:id', getComments);
router.put('/edit', authenticateUser, editComment);
router.delete('/', authenticateUser, deleteComment);

export default router;
