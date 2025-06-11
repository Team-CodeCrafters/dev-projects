import { Router } from 'express';
import {
  signin,
  signup,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js';
import {
  validateSignIn,
  validateSignUp,
  validateForgotPassword,
  validateResetPassword,
} from '../middleware/userValidation.js';
const router = Router();

router.post('/signup', validateSignUp, signup);
router.post('/signin', validateSignIn, signin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
export default router;
