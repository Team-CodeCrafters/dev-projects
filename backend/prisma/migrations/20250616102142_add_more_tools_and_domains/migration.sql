/*
  Warnings:

  - The values [FullStack,MobileDevelopment] on the enum `Domain` will be removed. If these variants are still used in the database, this will fail.
  - The values [ReactNative] on the enum `Tools` will be removed. If these variants are still used in the database, this will fail.
  - The `requirement` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Domain_new" AS ENUM ('Frontend', 'Backend', 'Web_Development', 'App_Development', 'AIML', 'UIUX', 'Fullstack', 'Blockchain', 'Data_Science', 'Cloud_Computing', 'DevOps');
ALTER TABLE "Project" ALTER COLUMN "domain" TYPE "Domain_new" USING ("domain"::text::"Domain_new");
ALTER TYPE "Domain" RENAME TO "Domain_old";
ALTER TYPE "Domain_new" RENAME TO "Domain";
DROP TYPE "Domain_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Tools_new" AS ENUM ('C', 'Python', 'Java', 'React', 'Node', 'HTML', 'CSS', 'Javascript', 'MongoDB', 'PostgreSQL', 'API', 'Git', 'React_Native', 'Angular', 'Vue', 'Express', 'Django', 'Flask', 'TensorFlow', 'Scikit_Learn', 'Pandas', 'NumPy', 'Kotlin', 'Swift', 'Firebase', 'MySQL', 'Docker', 'AWS', 'TypeScript', 'GraphQL');
ALTER TABLE "Project" ALTER COLUMN "tools" TYPE "Tools_new"[] USING ("tools"::text::"Tools_new"[]);
ALTER TYPE "Tools" RENAME TO "Tools_old";
ALTER TYPE "Tools_new" RENAME TO "Tools";
DROP TYPE "Tools_old";
COMMIT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "challenges" TEXT[],
DROP COLUMN "requirement",
ADD COLUMN     "requirement" TEXT[];
