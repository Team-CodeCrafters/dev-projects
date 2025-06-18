import { Router } from 'express';
import {
  signin,
  signup,
  forgotPassword,
  resetPassword,
  updateProfile,
  profile,
} from '../controllers/userController.js';
import {
  validateSignIn,
  validateSignUp,
  validateForgotPassword,
  validateResetPassword,
  validateProfileUpdate,
  authenticateUser,
} from '../middleware/userValidation.js';
import { upload } from '../middleware/multer.js';
const router = Router();

router.post('/signup', validateSignUp, signup);
router.post('/signin', validateSignIn, signin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.get('/profile', authenticateUser, profile);
router.put(
  '/update-profile',
  [authenticateUser, upload.single('avatar'), validateProfileUpdate],
  updateProfile,
);

export default router;
