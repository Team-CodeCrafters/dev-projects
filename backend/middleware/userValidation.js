import prisma from '../db/db.js';
import zod, { string } from 'zod';
import { verifyJWT } from '../utils/jwt.js';
import { comparePassword } from '../utils/bcrypt.js';

const usernameSchema = zod.string().regex(/^[a-zA-Z0-9_]{4,15}$/);
const signUpSchema = zod.object({
  username: usernameSchema,
  email: zod.string().email(),
  password: zod.string().min(8),
  displayName: zod.string().optional(),
});

const signInSchema = zod.object({
  identifier: zod.union([usernameSchema, zod.string().email()]),
  password: zod.string().min(8),
});

const forgotPasswordSchema = zod.object({ email: zod.string().email() });
const resetPasswordSchema = signUpSchema.pick({ password: true });

async function authenticateAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { userId } = verifyJWT(token);
    if (!userId) return res.status(401).json({ error: 'Invalid token' });
    const adminUser = await prisma.admin.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!adminUser) {
      return res.status(401).json({ error: 'Unauthorised admin user' });
    }
    req.adminId = adminUser.userId;
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Server Error', error: err.message });
  }
}

async function validateSignUp(req, res, next) {
  const zodResult = signUpSchema.safeParse(req.body);
  if (!zodResult.success) {
    return res.status(401).json({
      message: 'Invalid data',
      error: zodResult.error.errors[0].message,
    });
  }
  try {
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ username: req.body.username }, { email: req.body.email }],
      },
    });
    if (userExists) {
      return res.status(401).json({ message: 'User already exists' });
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function validateSignIn(req, res, next) {
  const { identifier, password } = req.body;
  const zodResult = signInSchema.safeParse({ identifier, password });
  if (!zodResult.success) {
    return res.status(401).json({
      message: 'Invalid data',
    });
  }
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });
  if (!user) {
    return res.status(401).json({ message: 'user does not exist' });
  }
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Incorrect password' });
  }
  req.userId = user.id;
  next();
}

async function validateForgotPassword(req, res, next) {
  const { email } = req.body;
  try {
    const { success } = forgotPasswordSchema.safeParse({ email });
    if (!success) {
      return res.status(401).json({ message: 'Invalid Email', error: e });
    }
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) return res.status(401).json({ message: 'email does not exist' });
    req.body.username = user.username;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'internal server error', error: e });
  }
}

async function validateResetPassword(req, res, next) {
  const token = req.query.token;
  const { password } = req.body;
  resetPasswordSchema.parse({ password });
  try {
    const JWTResponse = verifyJWT(token);

    if (JWTResponse.error) {
      return res.status(401).json({ message: 'link is invalid or expired' });
    }
    req.body.email = JWTResponse.email;
    next();
  } catch (e) {
    return res.status(500).json({ message: 'internal server error' });
  }
}

export {
  authenticateAdmin,
  validateSignUp,
  validateSignIn,
  validateForgotPassword,
  validateResetPassword,
};
