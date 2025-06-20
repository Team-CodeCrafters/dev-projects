import { Status } from '@prisma/client';
import zod from 'zod';

const projectStatusSchema = zod.object({
  status: zod.nativeEnum(Status, {
    message:
      'status is invalid possible values can be (started, inprogress, completed)',
  }),
  startedProjectId: zod.string({ message: 'project id is invalid' }),
});
async function validateUpdateProject(req, res, next) {
  const { status, startedProjectId } = req.body;
  const zodResult = projectStatusSchema.safeParse({
    status,
    startedProjectId,
  });

  if (!zodResult.success) {
    return res.status(401).json({
      mesage: 'invalid status or project id',
      error: zodResult?.error?.errors[0]?.message,
    });
  }
  next();
}

export { validateUpdateProject };
