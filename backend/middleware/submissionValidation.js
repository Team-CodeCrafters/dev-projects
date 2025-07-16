import zod from 'zod';

const submissionSchema = zod.object({
  title: zod
    .string({ message: 'title is required' })
    .max(60, { message: 'the maximum length of title is 60 chars' }),
  description: zod
    .string({ message: 'description is required' })
    .max(500, { message: 'the maximum length of description is 300 chars' })
    .optional(),
  githubRepo: zod
    .string({ message: 'invalid GitHub URL' })
    .startsWith('https://github.com/', { message: 'invalid GitHub URL' }),
  liveUrl: zod.string().optional(),
});

export function validateCreateSubmission(req, res, next) {
  try {
    const zodResult = submissionSchema.safeParse(req.body);

    if (!zodResult.success) {
      const zodError = zodResult.error.issues[0]?.message;
      return res.status(400).json({ message: 'Invalid data', error: zodError });
    }
    next();
  } catch (e) {
    return res
      .status(400)
      .json({ message: 'Internal server error', error: e.message });
  }
}
