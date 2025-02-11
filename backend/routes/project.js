import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProjectDetails,
  getProjects,
  updateProject,
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/userValidation.js';
import {
  validateProjectData,
  validateProjectFilters,
  validateProjectUpdate,
} from '../middleware/projectValidation.js';
import { upload } from '../middleware/multer.js';

const router = Router();
router.post(
  '/new',
  [authenticateAdmin, upload.array('images', 5), validateProjectData],
  createProject,
);
router.get('/all', validateProjectFilters, getProjects);
router.get('/:id', getProjectDetails);
router.patch('/:id', validateProjectUpdate, updateProject);
router.delete('/:id', deleteProject);

export default router;
