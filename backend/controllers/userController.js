import prisma from '../db/db.js';
import { createJWT } from '../utils/jwt.js';
import { hashPassword } from '../utils/bcrypt.js';
import { sendEmail } from '../utils/email.js';
import { getUserGitHubProfile } from '../utils/userGithubProfile.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
async function signup(req, res) {
  try {
    const { username, email, password, displayName } = req.body;
    // use GitHub profile picture as default
    const profileAvatarURL = await getUserGitHubProfile(email);
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
    const emailResponse = await sendEmail(email, username, url);
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
    const { email, displayName, profilePicture } = req.body;
    const updateData = {};
    if (email) updateData.email = email;
    if (displayName) updateData.displayName = displayName;
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

const profile = async (req, res) => {
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
  signup,
  signin,
  forgotPassword,
  resetPassword,
  profile,
  updateProfile,
  deleteAccount,
};
