import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProjectDetails,
  getProjects,
  getProjectsBySearch,
  getRecommendation,
  updateProject,
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/userValidation.js';
import {
  validateProjectData,
  validateProjectFilters,
  validateProjectUpdate,
  validateRecommendation,
} from '../middleware/projectValidation.js';
import { upload } from '../middleware/multer.js';

const router = Router();
router.post(
  '/new',
  [authenticateAdmin, upload.array('images', 5), validateProjectData],
  createProject,
);
router.get('/all', validateProjectFilters, getProjects);
router.get('/recommend', validateRecommendation, getRecommendation);
router.get('/:id', getProjectDetails);
router.get('/search/:name', getProjectsBySearch);
router.patch(
  '/:id',
  authenticateAdmin,
  [upload.array('images', 5), validateProjectUpdate],
  updateProject,
);
router.delete('/:id', authenticateAdmin, deleteProject);
export default router;
