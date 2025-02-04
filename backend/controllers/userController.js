import prisma from '../db/db.js';
import { createJWT, verifyJWT } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
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

export { signup, signin };
