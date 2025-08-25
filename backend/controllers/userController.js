import prisma from '../db/db.js';
import { createJWT } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { sendOTPEmail, sendResetEmail } from '../utils/email.js';
import { generateProfilePicture } from '../utils/profilePicture.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { generateOTP } from '../utils/generateOTP.js';

async function sendEmailVerification(req, res) {
  try {
    const { email } = req.body;
    const OTP = generateOTP();
    const hashedOTP = await hashPassword(OTP);

    // deleting previous OTP
    await prisma.userVerification.deleteMany({
      where: {
        email,
      },
    });

    await prisma.userVerification.create({
      data: {
        email,
        otp: hashedOTP,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const emailResponse = await sendOTPEmail(email, OTP);

    if (emailResponse.success) {
      return res
        .status(200)
        .json({ message: 'Verification email sent successfully' });
    }
    return res
      .status(500)
      .json({ message: 'Failed to send verification email' });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: e.message });
  }
}

async function userVerification(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(401).json({ message: 'Invalid email or OTP' });
    }
    const userVerification = await prisma.userVerification.findUnique({
      where: {
        email,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!userVerification) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const IsOTPVerified = await comparePassword(otp, userVerification.otp);

    if (!IsOTPVerified) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    await prisma.userVerification.update({
      where: {
        id: userVerification.id,
      },
      data: {
        isVerified: true,
      },
    });

    return res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
}

async function signup(req, res) {
  try {
    const { username, email, password, displayName } = req.body;
    // setting a profile picture for account
    const profileAvatarURL = await generateProfilePicture(email);
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        displayName,
        profilePicture: profileAvatarURL,
      },
    });
    const token = createJWT({ userId: user.id, userType: 'user' });
    res.status(200).json({ token, message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
}

async function signin(req, res) {
  const token = createJWT({ userId: req.userId });
  res.status(200).json({ token, message: 'user signin successful' });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const token = createJWT({ email: email }, '15min');
    const username = req.body.username;
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const emailResponse = await sendResetEmail(email, username, url);
    if (emailResponse.success) {
      return res.status(200).json({ message: 'email sent successfully' });
    }
    return res.status(500).json({ message: 'failed to send the email' });
  } catch (e) {
    return res.status(200).json({ message: 'failed to send email', error: e });
  }
}

async function resetPassword(req, res) {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });
    if (user)
      return res.status(200).json({ message: 'password changed successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { displayName, domain, experience, profilePicture } = req.body;
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (domain) updateData.domain = domain.split(',');
    if (experience) updateData.experience = experience;
    if (req.file) {
      const [avatarURL] = await uploadOnCloudinary(req.file);
      updateData.profilePicture = avatarURL;
    }
    if (profilePicture === 'DELETE') {
      updateData.profilePicture = null;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: updateData,
      select: {
        username: true,
        email: true,
        displayName: true,
        profilePicture: true,
        domain: true,
        experience: true,
      },
    });

    return res.status(200).json({
      message: 'user profile updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'failed to update user profile', error: e.message });
  }
}

const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: req.userId,
      },
      select: {
        username: true,
        email: true,
        displayName: true,
        profilePicture: true,
      },
    });
    return res
      .status(200)
      .json({ message: 'profile fetched successfully', user });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'failed to  fetched profile', error: e.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.userId,
      },
    });
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Failed to delete account', error: e.message });
  }
};

export {
  sendEmailVerification,
  userVerification,
  signup,
  signin,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
  deleteAccount,
};
