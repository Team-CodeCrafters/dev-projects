import { Router } from 'express';
import {
  validateCreateSubmission,
  validateUpdateSubmission,
} from '../middleware/submissionValidation.js';
import {
  createSubmission,
  deleteUserSubmission,
  getAllSubmissions,
  getAllSubmissionsOfProject,
  getAllSubmissionsOfUser,
  getUserSubmission,
  updateSubmission,
} from '../controllers/submission.js';
import { authenticateUser } from '../middleware/userValidation.js';

const router = Router();

router.get('/all/:projectId', getAllSubmissionsOfProject);
router.get('/all', getAllSubmissions);
router.use(authenticateUser);
router.get('/user/all', getAllSubmissionsOfUser);
router.get('/user/:id', getUserSubmission);
router.post('/', validateCreateSubmission, createSubmission);
router.put('/', validateUpdateSubmission, updateSubmission);
router.delete('/', deleteUserSubmission);

export default router;
