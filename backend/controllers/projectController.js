import prisma from '../db/db.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
async function getProjects(req, res) {
  try {
    const { difficulty, tools, domain } = req.filters;
    const query = {};
    if (difficulty) query['difficulty'] = difficulty;
    if (tools) query['tools'] = { equals: tools };
    if (domain) query['domain'] = domain;

    const filteredProjects = await prisma.project.findMany({
      where: query,
    });
    return res.status(200).json({
      message: 'projects fetched successfully',
      projects: filteredProjects,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
}

async function getProjectDetails(req, res) {
  try {
    const projectId = req.params.id;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return res.status(401).json({ message: 'project does not exist' });
    }
    res
      .status(200)
      .json({ message: 'project details sent successfully', project });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: err.message });
  }
}

async function createProject(req, res) {
  try {
    const projectExists = await prisma.project.findFirst({
      where: { name: req.body.name },
    });
    if (projectExists) {
      return res
        .status(401)
        .json({ message: 'Project with same name already exists' });
    }
    const cloudinaryUploads = [];
    for (const file of req.files) {
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      if (cloudinaryResponse)
        cloudinaryUploads.push(cloudinaryResponse.secure_url);
    }

    await prisma.project.create({
      data: {
        name: req.body.name.trim(),
        about: req.body.about,
        images: cloudinaryUploads,
        requirement: req.body.requirement,
        tools: req.body.tools,
        difficulty: req.body.difficulty,
        domain: req.body.domain,
        createdById: req.adminId,
      },
    });

    res.status(200).json({ message: 'Project created successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
}

async function updateProject(req, res) {
  try {
    const projectId = req.params.id;
    const updatedProject = await prisma.project.update({
      data: req.body,
      where: { id: projectId },
      select: true,
    });
    console.log(updatedProject);
    res
      .status(200)
      .json({ message: 'Project updated successfully', updatedProject });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
}

function deleteProject(req, res) {
  async function updateProject(req, res) {
    try {
      const projectId = req.params.id;
      const project = await prisma.project.delete({
        where: { id: projectId },
      });
      console.log(project);
      res
        .status(200)
        .json({ message: 'Project deleted successfully', project });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'internal server error', error: error.message });
    }
  }
}

export {
  createProject,
  getProjectDetails,
  getProjects,
  updateProject,
  deleteProject,
};
