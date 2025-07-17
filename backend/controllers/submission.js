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

export async function updateSubmission(req, res) {
  try {
    const updatedProject = await prisma.submissions.update({
      where: {
        id: req.body.submissionId,
      },
      data: req.updateData,
    });

    return res.status(200).json({ message: 'project updated', updatedProject });
  } catch (e) {
    console.log(e);

    if (e.code === 'P2003') {
      return res
        .status(400)
        .json({ message: 'Invalid project id', error: e.message });
    }
    if (e.code === 'P2025') {
      return res
        .status(400)
        .json({ message: 'no project found to update', error: e.message });
    }

    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}
