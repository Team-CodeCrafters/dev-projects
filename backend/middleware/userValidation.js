import prisma from '../db/db.js';
import zod from 'zod';
import { verifyJWT } from '../utils/jwt.js';
import { comparePassword } from '../utils/bcrypt.js';

const usernameSchema = zod.string().regex(/^[a-zA-Z0-9_]{4,20}$/, {
  message: 'username can have min 4 and max 20 characters',
});
const signUpSchema = zod.object({
  username: usernameSchema,
  email: zod.string().email(),
  password: zod
    .string()
    .min(8, { message: 'password must be atleast 8 characters long' }),
  displayName: zod.string({ message: 'invalid display name' }).optional(),
});

const signInSchema = zod.object({
  identifier: zod.union([usernameSchema, zod.string().email()]),
  password: zod.string().min(8),
});

const forgotPasswordSchema = zod.object({ email: zod.string().email() });
const resetPasswordSchema = signUpSchema.pick({ password: true });
const updateProfileSchema = signUpSchema
  .pick({
    displayName: true,
    domain: zod.array(zod.string()).optional(),
    experience: zod.string().optional(),
  })
  .partial();
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
async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const JWTResult = verifyJWT(token);
    if (JWTResult.error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const { userId, userType } = JWTResult;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    [req.userId, req.userType] = [userId, userType];
    next();
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'invalid server error', error: e.message });
  }
}

async function validateUserEmail(req, res, next) {
  const { email } = req.body;
  const { success } = zod.string().email().safeParse(email);
  if (!success) {
    return res.status(401).json({ message: 'Invalid Email' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res
        .status(409)
        .json({ message: 'user with email already exists' });
    }
    const lastVerification = await prisma.userVerification.findUnique({
      where: { email },
    });
    if (!lastVerification) {
      next();
      return;
    }
    const ResendTimeLimit = 2 * 60 * 1000;
    const isResendTimePassed =
      lastVerification &&
      lastVerification.createdAt.getTime() < Date.now() - ResendTimeLimit;

    if (!isResendTimePassed) {
      return res.status(429).json({
        message: 'Please wait 2 minutes before requesting new OTP',
      });
    }
    next();
  } catch (e) {
    return res.status(500).json({ message: 'internal server error' });
  }
}

async function validateSignUp(req, res, next) {
  const zodResult = signUpSchema.safeParse(req.body);
  if (!zodResult.success) {
    return res.status(401).json({
      message: 'Invalid data',
      error: zodResult.error.errors,
    });
  }
  try {
    const { username, email } = req.body;
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (!userExists) {
      return next();
    }

    if (userExists.email === email) {
      return res.status(409).json({
        message: 'user with email already exists',
      });
    }
    if (userExists.username === username) {
      return res.status(409).json({
        message: 'Username is already taken',
      });
    }
  } catch (error) {
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
    return res.status(500).json({ message: 'internal server error', error: e });
  }
}

async function validateResetPassword(req, res, next) {
  try {
    const token = req.query.token;
    const { password } = req.body;
    resetPasswordSchema.parse({ password });
    const JWTResponse = verifyJWT(token);
    if (JWTResponse.error) {
      return res.status(401).json({ message: 'link is invalid or expired' });
    }
    req.body.email = JWTResponse.email;
    next();
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}

async function validateProfileUpdate(req, res, next) {
  const { displayName, domain, experience } = req.body;
  const ZodResponse = updateProfileSchema.safeParse({
    displayName,
    domain,
    experience,
  });
  if (!ZodResponse.success) {
    return res.status(401).json({ message: 'invalid data' });
  }
  next();
}

export {
  authenticateAdmin,
  authenticateUser,
  validateSignUp,
  validateUserEmail,
  validateSignIn,
  validateForgotPassword,
  validateResetPassword,
  validateProfileUpdate,
};
