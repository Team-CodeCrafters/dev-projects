import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.project.createMany({
    data: projects,
    skipDuplicates: true,
  });
}
try {
  await main();
} catch (e) {
  console.log('an error occured');
  console.log(e);
} finally {
  await prisma.$disconnect();
  process.exit(0);
}
