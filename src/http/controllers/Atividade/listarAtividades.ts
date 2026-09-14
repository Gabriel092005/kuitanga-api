import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { escolaDoUsuario } from "../Aula/escolaDoUsuario";

export async function listarAtividades(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId, role } = request.user as { sub: string; role?: string };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { turmaId: true },
  });

  const escolaId = await escolaDoUsuario(userId);

  const isProfessorOuAdmin = role === "PROFESSOR" || role === "ADMIN";

  const atividades = await prisma.atividade.findMany({
    where: {
      escolaId: escolaId ?? undefined,
      ...(isProfessorOuAdmin
        ? {}
        : {
            OR: [
              { turmaId: null },
              { turmaId: user?.turmaId ?? "__none__" },
            ],
          }),
    },
    orderBy: { id: "asc" },
  });

  const realizadas = await prisma.atividade_realizada.findMany({
    where: { userId },
    select: { atividadeId: true },
  });

  const concluidas = realizadas.map((r) => r.atividadeId);

  return reply.status(200).send({
    atividades: atividades.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      materia: a.materia,
      pontos: a.pontos,
      dificuldade: a.dificuldade,
      descricao: a.descricao,
      tempoEstimado: a.tempoEstimado,
      cor: a.cor,
      icone: a.icone,
      respondidas: a.respondidas,
      turmaId: a.turmaId,
    })),
    concluidas,
  });
}