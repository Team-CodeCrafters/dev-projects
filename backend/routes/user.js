import { Router } from 'express';
import { signin, signup } from '../controllers/userController.js';
import {
  validateSignIn,
  validateSignUp,
} from '../middleware/userValidation.js';
const router = Router();

router.post('/signup', validateSignUp, signup);
router.post('/signin', validateSignIn, signin);

export default router;
