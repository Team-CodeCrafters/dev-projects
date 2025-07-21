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
      return res.status(400).json({ message: 'project is already submitted' });
    }

    if (e.code === 'P2003') {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function updateSubmission(req, res) {
  try {
    const updatedProject = await prisma.submissions.update({
      where: {
        id: req.body.submissionId,
        userId: req.userId,
      },
      data: req.updateData,
    });

    return res.status(200).json({ message: 'project updated', updatedProject });
  } catch (e) {
    if (e.code === 'P2003') {
      return res.status(400).json({ message: 'Invalid project id' });
    }
    if (e.code === 'P2025') {
      return res.status(404).json({ message: 'no project found to update' });
    }

    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function getAllSubmissionsOfUser(req, res) {
  try {
    const submissions = await prisma.submissions.findMany({
      where: {
        userId: req.userId,
      },
    });

    return res
      .status(200)
      .json({ message: 'submissions fetched successfully', submissions });
  } catch (e) {
    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function getUserSubmission(req, res) {
  try {
    const projectId = req.params.id;
    const submission = await prisma.submissions.findFirstOrThrow({
      where: {
        userId: req.userId,
        projectId: projectId,
      },
    });

    return res
      .status(200)
      .json({ message: 'submission fetched successfully', submission });
  } catch (e) {
    if (e.code === 'P2025') {
      return res.status(404).json({
        message: 'no submission found for the project',
      });
    }

    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function getAllSubmissionsOfProject(req, res) {
  try {
    const projectId = req.params.projectId;

    const submissions = await prisma.submissions.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        id: true,
        title: true,
        githubRepo: true,
        tools: true,
        liveUrl: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            displayName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (submissions.length <= 0) {
      return res.status(404).json({
        message: 'no submission found for the project',
      });
    }

    return res
      .status(200)
      .json({ message: 'submissions fetched successfully', submissions });
  } catch (e) {
    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function deleteUserSubmission(req, res) {
  try {
    const { submissionId } = req.body;
    if (!submissionId || typeof submissionId !== 'string') {
      return res.status(400).json({ message: 'invalid submissionId' });
    }
    await prisma.submissions.delete({
      where: {
        id: submissionId,
        userId: req.userId,
      },
    });

    return res
      .status(200)
      .json({ message: 'submission was deleted successfully' });
  } catch (e) {
    if (e.code === 'P2025') {
      return res.status(404).json({ message: 'submission does not exist' });
    }
    return res.status(500).json({ message: 'internal server error' });
  }
}
