import prisma from '../db/db.js';
import { createJWT, verifyJWT } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { sendEmail } from '../utils/email.js';

async function signup(req, res) {
  try {
    const { username, email, password, displayName } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        displayName,
      },
    });
    const token = createJWT({ userId: user.id });
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
    console.log(e);
    return res.status(200).json({ message: 'failed to send email', error: e });
  }
}

async function resetPassword(req, res) {
  const { email, password } = req.body;
  console.log(email, password);
  const hashedPassword = await hashPassword(password);
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });
    if (user)
      return res.status(200).json({ message: 'password changed successfully' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
}
export { signup, signin, forgotPassword, resetPassword };
