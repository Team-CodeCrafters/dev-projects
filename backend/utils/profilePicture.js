async function getUserGitHubProfile(email) {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(
      `https://api.github.com/search/users?q=${encodedEmail}+in%3Aemail`,
    );
    const userObject = await response.json();
    if (userObject?.items.length > 0) {
      return userObject.items[0]['avatar_url'];
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

function generateGradientSVG() {
  const width = 64;
  const height = 64;
  const colors = [
    '#1A1A1A',
    '#0A3149',
    '#4B0082',
    '#EC4899',
    '#06B6D4',
    '#8B5CF6',
    '#3B82F6',
    '#F3F4F6',
    '#FFC107',
    '#2E7D32',
    '#7C4DFF',
    '#F97316',
  ];

  let index1 = Math.floor(Math.random() * colors.length);
  let index2 = Math.floor(Math.random() * colors.length);

  while (index2 === index1) {
    index2 = Math.floor(Math.random() * colors.length);
  }
  const color1 = colors[index1];
  const color2 = colors[index2];

  const angle = Math.random() * 360;
  const rad = (angle * Math.PI) / 180;
  const x1 = (Math.cos(rad) * width) / 2 + width / 2;
  const y1 = (Math.sin(rad) * height) / 2 + height / 2;
  const x2 = (Math.cos(rad + Math.PI) * width) / 2 + width / 2;
  const y2 = (Math.sin(rad + Math.PI) * height) / 2 + height / 2;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${width / 2}" cy="${height / 2}" r="${width / 2}" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">
          <stop stop-color="${color1}" />
          <stop offset="1" stop-color="${color2}" />
        </linearGradient>
      </defs>
    </svg>
  `;

  const svgDataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  return svgDataUrl;
}

async function generateProfilePicture(email) {
  if (!email) return generateGradientSVG();

  const githubAvatarURL = await getUserGitHubProfile(email);

  return githubAvatarURL ? githubAvatarURL : generateGradientSVG();
}
export { generateProfilePicture };
