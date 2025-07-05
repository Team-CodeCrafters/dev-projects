import prisma from '../db/db.js';

async function createBookmark(req, res) {
  try {
    const { projectId } = req.body;

    await prisma.bookmarks.create({
      data: {
        userId: req.userId,
        projectId: projectId,
      },
    });

    return res.status(200).json({ message: 'bookmark created successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        message: 'Project is already bookmarked',
        error: error.message,
      });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        message: 'Project does not exist or invalid project id',
        error: error.message,
      });
    }

    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
}

export { createBookmark };
