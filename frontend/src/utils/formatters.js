import { formatDistanceToNow } from 'date-fns';

function formatString(str) {
  if (typeof str !== 'string') {
    return null;
  }
  return str.split('_').join(' ').trim();
}

function formatDate(date) {
  const dateString = formatDistanceToNow(new Date(date), { addSuffix: true });

  return dateString.replace(/^(about|over|almost) /, '');
}

function structureComments(comments) {
  const resultComments = [];
  comments.forEach((comment) => {
    if (comment.parentId === null) {
      comment.replies = [];
      resultComments.push(comment);
      return;
    }
    const parent = comments.find(({ id }) => id === comment.parentId);

    if (parent?.replies?.length > 0) parent.replies.push(comment);
    else parent.replies = [comment];
  });

  return resultComments;
}

export { formatString, formatDate, structureComments };
