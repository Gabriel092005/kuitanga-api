-- AlterTable
ALTER TABLE "aulas" ADD COLUMN     "turmaId" TEXT;

-- CreateTable
CREATE TABLE "turmas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "professorId" TEXT NOT NULL,
    "escolaId" TEXT NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "aulas" ADD CONSTRAINT "aulas_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
