import { Router } from 'express';
import {
  signin,
  signup,
  forgotPassword,
  resetPassword,
  updateProfile,
  profile,
  deleteAccount,
  sendEmailVerification,
  userVerification,
} from '../controllers/userController.js';
import {
  validateSignIn,
  validateSignUp,
  validateForgotPassword,
  validateResetPassword,
  validateProfileUpdate,
  authenticateUser,
  validateUserEmail,
} from '../middleware/userValidation.js';
import { upload } from '../middleware/multer.js';
const router = Router();

router.post('/email-verification', validateUserEmail, sendEmailVerification);
router.post('/verify-otp', userVerification);

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
router.delete('/', authenticateUser, deleteAccount);

export default router;
