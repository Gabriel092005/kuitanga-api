import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const ats = await p.atividade.findMany({
    orderBy: { id: "asc" },
    select: { id: true, titulo: true, materia: true, escolaId: true, userId: true, turmaId: true },
  });
  console.log("total=" + ats.length);
  for (const a of ats) {
    console.log(a.id + " | " + a.titulo + " | " + a.materia + " | escola=" + (a.escolaId ?? "NULL") + " | turma=" + (a.turmaId ?? "NULL"));
  }
}

main().finally(() => p.$disconnect());