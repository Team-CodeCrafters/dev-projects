import prisma from '../db/db.js';
export async function createSubmission(req, res) {
  try {
    const submittedProject = await prisma.submissions.create({
      data: {
        userId: req.userId,
        ...req.body,
      },
    });

    return res
      .status(200)
      .json({ message: 'project submitted', submittedProject });
  } catch (e) {
    if (e.code === 'P2002') {
      return res
        .status(400)
        .json({ message: 'project is already submitted', error: e.message });
    }

    if (e.code === 'P2003') {
      return res
        .status(400)
        .json({ message: 'Invalid project id', error: e.message });
    }

    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}
