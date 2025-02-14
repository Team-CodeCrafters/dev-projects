import zod from 'zod';
import prisma from '../db/db.js';
import { Difficulty, Tools, Domain } from '@prisma/client';
import errorMap from 'zod/locales/en.js';

const projectSchema = zod.object({
  name: zod.string().max(45),
  about: zod.string(),
  requirement: zod.string().optional(),
  difficulty: zod.nativeEnum(Difficulty),
  tools: zod.array(zod.nativeEnum(Tools)),
  domain: zod.nativeEnum(Domain),
});

const updateProjectSchema = zod
  .object({
    about: zod.string().optional(),
    requirement: zod.string().optional(),
    difficulty: zod.nativeEnum(Difficulty).optional(),
    tools: zod
      .array(zod.union([zod.nativeEnum(Tools), zod.string().max(0)]))
      .optional(),
    domain: zod.nativeEnum(Domain).optional(),
  })
  .strict();

const projectFilterSchema = zod.object({
  difficulty: zod
    .union([zod.nativeEnum(Difficulty), zod.string().max(0)])
    .optional(),
  tools: zod
    .array(zod.union([zod.nativeEnum(Tools), zod.string().max(0)]))
    .optional(),
  domain: zod.union([zod.nativeEnum(Domain), zod.string().max(0)]).optional(),
});

async function validateProjectData(req, res, next) {
  req.body.tools = req.body.tools?.split(',');
  const zodResponse = projectSchema.safeParse(req.body);
  if (!zodResponse.success) {
    return res.status(401).json({
      message: 'Invalid Project details',
      error: zodResponse.error.errors,
    });
  }
  next();
}

async function validateProjectUpdate(req, res, next) {
  if (req.body.tools) {
    req.body.tools = req.body.tools?.split(',');
  }

  const zodResponse = updateProjectSchema.safeParse(req.body);
  if (!zodResponse.success) {
    return res.status(401).json({
      message: 'Invalid project details',
      error: zodResponse.error.errors,
    });
  } else {
    req.parsedData = zodResponse.data;
  }
  next();
}

async function validateProjectFilters(req, res, next) {
  let { difficulty, domain, tools } = req.query;
  tools = tools?.split(',');
  req.filters = { difficulty, domain, tools };
  const zodResponse = projectFilterSchema.safeParse(req.filters);
  if (!zodResponse.success) {
    return res.status(401).json({
      message: 'Invalid filters',
      error: zodResponse.error.errors,
    });
  }
  next();
}

export { validateProjectData, validateProjectFilters, validateProjectUpdate };
