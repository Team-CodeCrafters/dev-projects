import { Router } from 'express';
import { authenticateUser } from '../middleware/userValidation.js';
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from '../controllers/bookmarkController.js';
import {
  validateCreateBookmark,
  validateDeleteBookmark,
} from '../middleware/bookmarkValidation.js';

const router = Router();

router.get('/', authenticateUser, getBookmarks);
router.post('/', authenticateUser, validateCreateBookmark, createBookmark);
router.delete('/', authenticateUser, validateDeleteBookmark, deleteBookmark);

export default router;
