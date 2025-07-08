import prisma from '../db/db.js';

// narrow down the field to get more related projects
export async function recommendOtherProjects(
  domain,
  difficulty,
  maxCount,
  excludeIds = [],
) {
  const query = {};

  // choosing only domain if both were provided
  if (domain && difficulty) {
    query['domain'] = domain;
  }
  if (!domain && difficulty) {
    query['difficulty'] = difficulty;
  }
  const projects = await prisma.project.findMany({
    take: maxCount,
    where: {
      ...query,
      id: {
        notIn: excludeIds,
      },
    },
  });
  return projects;
}
