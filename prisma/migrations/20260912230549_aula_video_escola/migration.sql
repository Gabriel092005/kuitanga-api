-- AlterTable
ALTER TABLE "aulas" ADD COLUMN     "escolaId" TEXT,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;
