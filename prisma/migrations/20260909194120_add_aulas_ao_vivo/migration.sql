-- CreateTable
CREATE TABLE "aulas_ao_vivo" (
    "id" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "materia" TEXT NOT NULL,
    "professor" TEXT NOT NULL DEFAULT 'A confirmar',
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "status" "StatusAgendamentos" NOT NULL DEFAULT 'AGENDADO',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aulas_ao_vivo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "aulas_ao_vivo" ADD CONSTRAINT "aulas_ao_vivo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
