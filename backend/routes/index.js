import { Router } from 'express';
import userRouter from './user.js';
import projectRouter from './project.js';
import userProjectsRouter from './userProjects.js';
const router = Router();
router.use('/user', userRouter);
router.use('/project', projectRouter);
router.use('/user-projects', userProjectsRouter);

export default router;
