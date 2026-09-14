-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PROFESSOR';

-- AlterTable
ALTER TABLE "aulas_ao_vivo" ADD COLUMN     "turmaId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "turmaId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aulas_ao_vivo" ADD CONSTRAINT "aulas_ao_vivo_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
