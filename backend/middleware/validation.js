import zod from 'zod';
import prisma from '../db/db.js';
import { comparePassword } from '../utils/bcrypt.js';
const signUpSchema = zod.object({
  username: zod.string().regex(/^[a-zA-Z0-9_]{4,15}$/),
  email: zod.string().email(),
  password: zod.string().min(8),
  displayName: zod.string().optional(),
});

const signInSchema = zod.object({
  identifier: zod.union([
    zod.string().regex(/^[a-zA-Z0-9_]{4,15}$/),
    zod.string().email(),
  ]),
  password: zod.string().min(8),
});

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
    res.status(500).json({ message: 'Internal server error on signUP' });
  }
}

async function validateSignIn(req, res, next) {
  const { identifier, password } = req.body;
  const zodResult = signInSchema.safeParse({ identifier, password });
  console.log(zodResult);
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
    return res.status(401).json({ message: 'use does not exist' });
  }
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Incorrect password' });
  }
  req.userId = user.id;
  next();
}
export { signUpSchema, validateSignUp, validateSignIn };
