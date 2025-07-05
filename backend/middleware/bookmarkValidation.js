import zod from 'zod';

const createBookmarkSchema = zod.object({
  projectId: zod.string({ message: 'project id is invalid' }),
});

function validateCreateBookmark(req, res, next) {
  const { projectId } = req.body;
  const zodResult = createBookmarkSchema.safeParse({ projectId });

  if (!zodResult.success) {
    return res.status(400).json({
      mesage: 'invalid project id',
      error: zodResult?.error?.errors[0]?.message,
    });
  }
  next();
}

export { validateCreateBookmark };
