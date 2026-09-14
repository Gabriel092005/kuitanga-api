-- CreateTable
CREATE TABLE "atividades" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "pontos" INTEGER NOT NULL DEFAULT 10,
    "dificuldade" TEXT NOT NULL DEFAULT 'Facil',
    "descricao" TEXT NOT NULL DEFAULT '',
    "tempoEstimado" TEXT NOT NULL DEFAULT '10 min',
    "cor" TEXT NOT NULL DEFAULT 'azul',
    "icone" TEXT NOT NULL DEFAULT 'file',
    "perguntas" JSONB NOT NULL,
    "respondidas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "escolaId" TEXT,
    "turmaId" TEXT,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades_realizadas" (
    "id" SERIAL NOT NULL,
    "atividadeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "acertos" INTEGER NOT NULL DEFAULT 0,
    "erros" INTEGER NOT NULL DEFAULT 0,
    "pontosGanhos" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atividades_realizadas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "atividades_realizadas_atividadeId_userId_key" ON "atividades_realizadas"("atividadeId", "userId");

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_escolaId_fkey" FOREIGN KEY ("escolaId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades_realizadas" ADD CONSTRAINT "atividades_realizadas_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "atividades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades_realizadas" ADD CONSTRAINT "atividades_realizadas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
