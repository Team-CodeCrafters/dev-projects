import { Router } from 'express';
import { authenticateUser } from '../middleware/userValidation.js';
import { createBookmark } from '../controllers/bookmarkController.js';
import { validateCreateBookmark } from '../middleware/bookmarkValidation.js';

const router = Router();

router.post('/', authenticateUser, validateCreateBookmark, createBookmark);

export default router;
