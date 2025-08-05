import { Router } from 'express';
import userRouter from './user.js';
import projectRouter from './project.js';
import userProjectsRouter from './userProjects.js';
import bookmarkRouter from './bookmark.js';
import SubmissionsRouter from './submission.js';
import commentRouter from './comment.js';

const router = Router();
router.use('/user', userRouter);
router.use('/project', projectRouter);
router.use('/user-projects', userProjectsRouter);
router.use('/bookmark', bookmarkRouter);
router.use('/submissions', SubmissionsRouter);
router.use('/comments', commentRouter);

router.get('/ping', (_, res) => {
  res
    .status(200)
    .set('Content-Type', 'text/plain')
    .set('Content-Length', '2')
    .end('OK');
});

export default router;
