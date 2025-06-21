import prisma from '../db/db.js';

async function startProject(req, res) {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(401).json({ message: 'Invalid project id' });
    }

    await prisma.userProject.create({
      data: {
        userId: req.userId,
        projectId: projectId,
        status: 'started',
      },
    });

    return res.status(200).json({ message: 'projected started successfully' });
  } catch (e) {
    if (e.code === 'P2003') {
      return res.status(401).json({ message: 'project does not exists' });
    }

    if (e.code === 'P2002') {
      return res.status(401).json({ message: 'project is already started' });
    }

    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}

async function getStartedProjects(req, res) {
  try {
    const startedProjects = await prisma.userProject.findMany({
      where: {
        userId: req.userId,
      },
    });

    return res.status(200).json({
      message: 'projects fetched successfully',
      projects: startedProjects,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}
async function updateStartedProject(req, res) {
  try {
    const { status, startedProjectId } = req.body;

    if (!status) {
      return res.status(401).json({ message: 'Invalid status' });
    }

    if (!startedProjectId) {
      return res.status(401).json({ message: 'Invalid project id' });
    }

    const updatedProject = await prisma.userProject.update({
      where: {
        id: startedProjectId,
      },
      data: {
        status: status,
      },
    });

    return res.status(200).json({
      message: 'project updated successfully',
      project: updatedProject,
    });
  } catch (e) {
    if (e.code === 'P2025') {
      return res
        .status(401)
        .json({ message: 'project does not exists ', error: e.message });
    }

    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}

export { startProject, getStartedProjects, updateStartedProject };
