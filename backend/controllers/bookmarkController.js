import prisma from '../db/db.js';

async function createBookmark(req, res) {
  try {
    const { projectId } = req.body;

    const bookmark = await prisma.bookmarks.create({
      data: {
        userId: req.userId,
        projectId: projectId,
      },
      select: {
        id: true,
        createdAt: true,
        project: true,
      },
    });

    return res
      .status(200)
      .json({ message: 'bookmark created successfully', bookmark });
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

async function getBookmarks(req, res) {
  try {
    const bookmarkedProjects = await prisma.bookmarks.findMany({
      where: {
        userId: req.userId,
      },
      select: {
        id: true,
        createdAt: true,
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res
      .status(200)
      .json({ message: 'bookmarks fetched successfully', bookmarkedProjects });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
}

async function deleteBookmark(req, res) {
  try {
    const { bookmarkId } = req.body;

    await prisma.bookmarks.delete({
      where: {
        id: bookmarkId,
      },
    });

    return res.status(200).json({ message: 'bookmark deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).json({
        message: 'bookmark does not exist or invalid bookmark id',
        error: error.message,
      });
    }

    return res
      .status(500)
      .json({ message: 'Internal server error.', error: error.message });
  }
}

export { createBookmark, getBookmarks, deleteBookmark };
