-- CreateTable
CREATE TABLE "aulas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "duracao" TEXT NOT NULL,
    "visualizacoes" INTEGER NOT NULL DEFAULT 0,
    "data" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'azul',
    "descricao" TEXT NOT NULL,
    "topicos" TEXT[],

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id")
);
