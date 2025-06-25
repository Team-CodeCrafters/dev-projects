function formatString(str) {
  if (typeof str !== 'string') {
    return null;
  }
  return str.split('_').join(' ').trim();
}

export { formatString };
