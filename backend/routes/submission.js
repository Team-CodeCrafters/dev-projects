import { Router } from 'express';
import { validateCreateSubmission } from '../middleware/submissionValidation.js';
import { createSubmission } from '../controllers/submission.js';
import { authenticateUser } from '../middleware/userValidation.js';
const router = Router();

router.use(authenticateUser);
router.post('/', validateCreateSubmission, createSubmission);

export default router;
