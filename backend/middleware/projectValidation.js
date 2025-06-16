import zod, { tuple } from 'zod';
import { Difficulty, Tools, Domain } from '@prisma/client';

const projectSchema = zod.object({
  name: zod
    .string()
    .max(45, { message: 'name is too long' })
    .nonempty({ message: 'name is required' }),
  about: zod.string().nonempty({ message: 'about is required' }),
  requirement: zod.array(
    zod.string().nonempty({ message: 'requirement item cannot be empty' }),
  ),
  difficulty: zod.nativeEnum(Difficulty, {
    message: 'difficulty is incorrect',
  }),
  tools: zod.array(zod.nativeEnum(Tools, { message: 'tools are incorrect' })),
  domain: zod.nativeEnum(Domain, { message: 'domain is incorrect' }),
  challenges: zod.array(zod.string().nonempty()).optional(),
  createdBy: zod.string().optional(),
});

const updateProjectSchema = projectSchema.partial();

const projectFilterSchema = projectSchema
  .pick({
    difficulty: true,
    domain: true,
    tools: true,
  })
  .partial();

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
