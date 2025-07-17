import { Router } from 'express';
import {
  validateCreateSubmission,
  validateUpdateSubmission,
} from '../middleware/submissionValidation.js';
import {
  createSubmission,
  updateSubmission,
} from '../controllers/submission.js';
import { authenticateUser } from '../middleware/userValidation.js';
const router = Router();

router.use(authenticateUser);
router.post('/', validateCreateSubmission, createSubmission);
router.put('/', validateUpdateSubmission, updateSubmission);

export default router;
