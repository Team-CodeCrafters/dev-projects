/*
  Warnings:

  - The values [Fullstack] on the enum `Domain` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Domain_new" AS ENUM ('Frontend', 'Backend', 'Web_Development', 'App_Development', 'AIML', 'UIUX', 'Full_Stack', 'Blockchain', 'Data_Science', 'Cloud_Computing', 'DevOps');
ALTER TABLE "Project" ALTER COLUMN "domain" TYPE "Domain_new" USING ("domain"::text::"Domain_new");
ALTER TYPE "Domain" RENAME TO "Domain_old";
ALTER TYPE "Domain_new" RENAME TO "Domain";
DROP TYPE "Domain_old";
COMMIT;
