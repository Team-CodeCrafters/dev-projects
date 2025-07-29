import prisma from '../db/db.js';

export async function createComment(req, res) {
  try {
    const { message, projectId, parentId } = req.body;

    if (!message) {
      return res.status(401).json({
        message: 'invalid message',
        error: 'invalid data',
      });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: req.userId,
        projectId: projectId,
        message: message,
        ...(parentId && { parentId }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profilePicture: true,
          },
        },
      },
    });
    return res
      .status(200)
      .json({ message: 'comment posted successfully', comment });
  } catch (e) {
    if (e.code === 'P2003') {
      return res.status(401).json({
        message: 'invalid data',
        error: 'invalid project Id or parent Id',
      });
    }
    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}

export async function getComments(req, res) {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res.status(401).json({ message: 'invalid project id' });
    }

    const comments = await prisma.comment.findMany({
      where: { projectId: projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return res
      .status(200)
      .json({ message: 'comments fetched successfully', comments });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}

export async function editComment(req, res) {
  try {
    const { commentId, message } = req.body;
    if (!message) {
      return res.status(401).json({ error: 'invalid message' });
    }
    if (!commentId) {
      return res.status(401).json({ error: 'invalid comment id' });
    }
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        message: message,
        isEdited: true,
      },
    });
    return res
      .status(200)
      .json({ message: 'commented edited succefully', comment });
  } catch (e) {
    if (e.code === 'P2025') {
      return res
        .status(401)
        .json({ error: 'comment was deleted or does not exist' });
    }

    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}

export async function deleteComment(req, res) {
  try {
    const { commentId } = req.body;

    if (!commentId) {
      return res.status(401).json({ error: 'invalid comment id' });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return res.status(200).json({ message: 'commented deleted succefully' });
  } catch (e) {
    if (e.code === 'P2025') {
      return res
        .status(401)
        .json({ error: 'comment was deleted or does not exist' });
    }
    return res
      .status(500)
      .json({ message: 'internal server error', error: e.message });
  }
}

export async function voteComment(req, res) {
  try {
    const { commentId, voteType } = req.body;

    if (!commentId || !['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const existingVotedComment = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId: req.userId,
          commentId,
        },
      },
    });

    if (existingVotedComment) {
      if (existingVotedComment.voteType === voteType) {
        // remove the vote
        await prisma.$transaction([
          prisma.commentVote.delete({
            where: { id: existingVotedComment.id },
          }),
          prisma.comment.update({
            where: { id: commentId },
            data:
              voteType === 'UPVOTE'
                ? { upvoteCount: { decrement: 1 } }
                : { downvoteCount: { decrement: 1 } },
          }),
        ]);

        return res
          .status(200)
          .json({ message: 'Vote removed from the comment' });
      } else {
        // update the vote
        await prisma.$transaction([
          prisma.commentVote.update({
            where: { id: existingVotedComment.id },
            data: { voteType },
          }),
          prisma.comment.update({
            where: { id: commentId },
            data:
              voteType === 'UPVOTE'
                ? {
                    upvoteCount: { increment: 1 },
                    downvoteCount: { decrement: 1 },
                  }
                : {
                    downvoteCount: { increment: 1 },
                    upvoteCount: { decrement: 1 },
                  },
          }),
        ]);

        return res.status(200).json({ message: 'Vote updated' });
      }
    } else {
      // Add new vote
      await prisma.$transaction([
        prisma.commentVote.create({
          data: {
            commentId,
            userId: req.userId,
            voteType,
          },
        }),
        prisma.comment.update({
          where: { id: commentId },
          data:
            voteType === 'UPVOTE'
              ? { upvoteCount: { increment: 1 } }
              : { downvoteCount: { increment: 1 } },
        }),
      ]);

      return res.status(200).json({ message: 'Vote added' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUserVotes(req, res) {
  try {
    const votedComments = await prisma.commentVote.findMany({
      where: {
        userId: req.userId,
      },
      select: {
        id: true,
        commentId: true,
        voteType: true,
      },
    });
    return res
      .status(200)
      .json({ message: 'user voted comments fetched', votedComments });
  } catch (e) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error: e.message });
  }
}
