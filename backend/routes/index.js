import { Router } from 'express';
import userRouter from './user.js';
import projectRouter from './project.js';

const router = Router();
router.use('/user', userRouter);
router.use('/project', projectRouter);

export default router;
