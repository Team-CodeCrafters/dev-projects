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

export { getUserGitHubProfile };
