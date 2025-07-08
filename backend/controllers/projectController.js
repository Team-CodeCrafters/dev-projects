import prisma from '../db/db.js';
import fs from 'fs';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { recommendOtherProjects } from '../utils/project.js';
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
      for (const file of req.files) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
      return res
        .status(401)
        .json({ message: 'Project with same name already exists' });
    }
    if (req.files && req.files.length > 0) {
      req.body.files = await uploadOnCloudinary(req.files);
    }

    await prisma.project.create({
      data: {
        name: req.body.name.trim(),
        about: req.body.about,
        images: req.body.files,
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
    if (req.files && req.files.length > 0) {
      const cloudinaryResponse = await uploadOnCloudinary(req.files);
      if (cloudinaryResponse?.length > 0) {
        req.parsedData.images = cloudinaryResponse;
      }
    }
    const projectId = req.params.id;
    const updatedProject = await prisma.project.update({
      data: req.parsedData,
      where: { id: projectId },
    });

    if (!updatedProject) {
      return res.status(401).json({ message: 'Project does not exists' });
    }
    return res
      .status(200)
      .json({ message: 'Project updated successfully', updatedProject });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    const projectId = req.params.id;
    await prisma.project.delete({
      where: { id: projectId },
    });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
}

async function getRecommendation(req, res) {
  const {
    difficulty,
    domain,
    tools,
    maxCount = 3,
    excludeIds = [],
  } = req.filters;

  const query = {};
  if (difficulty) query['difficulty'] = difficulty;
  if (tools) query['tools'] = { hasSome: tools };
  if (domain) query['domain'] = domain;

  try {
    const recommendedprojects = await prisma.project.findMany({
      take: maxCount,
      where: {
        ...query,
        id: {
          notIn: excludeIds,
        },
      },
    });
    console.log(recommendedprojects.length <= 0);

    if (recommendedprojects.length <= 0) {
      const otherProjects = await recommendOtherProjects(
        domain,
        difficulty,
        maxCount,
        excludeIds,
      );

      return res
        .status(200)
        .json({ message: 'projects fetched', otherProjects });
    }
    res.status(200).json({ message: 'projects fetched', recommendedprojects });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
}

export {
  createProject,
  getProjectDetails,
  getProjects,
  updateProject,
  deleteProject,
  getRecommendation,
};
