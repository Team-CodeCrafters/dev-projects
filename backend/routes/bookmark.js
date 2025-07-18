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
router.use(authenticateUser);
router.get('/', getBookmarks);
router.post('/', validateCreateBookmark, createBookmark);
router.delete('/', validateDeleteBookmark, deleteBookmark);

export default router;
