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

export { formatString, formatDate };
