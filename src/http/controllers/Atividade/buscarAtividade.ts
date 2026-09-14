import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { escolaDoUsuario } from "../Aula/escolaDoUsuario";

export async function buscarAtividade(request: FastifyRequest, reply: FastifyReply) {
  const buscarAtividadeParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const { id } = buscarAtividadeParamsSchema.parse(request.params);

  const { sub: userId, role } = request.user as { sub: string; role?: string };

  const atividade = await prisma.atividade.findUnique({ where: { id } });
  if (!atividade) {
    return reply.status(404).send({ message: "atividade nao encontrada" });
  }

  if (role === "MEMBER") {
    const [escolaId, user] = await Promise.all([
      escolaDoUsuario(userId),
      prisma.user.findUnique({ where: { id: userId }, select: { turmaId: true } }),
    ]);

    const naMesmaEscola = atividade.escolaId && atividade.escolaId === escolaId;
    const daTurmaDoAluno = atividade.turmaId && atividade.turmaId === user?.turmaId;
    const generica = !atividade.turmaId;

    if (!naMesmaEscola || !(generica || daTurmaDoAluno)) {
      return reply.status(403).send({ message: "atividade indisponivel para o utilizador" });
    }
  }

  const realizada = await prisma.atividade_realizada.findUnique({
    where: { atividadeId_userId: { atividadeId: id, userId } },
  });

  return reply.status(200).send({
    atividade: {
      id: atividade.id,
      titulo: atividade.titulo,
      materia: atividade.materia,
      pontos: atividade.pontos,
      dificuldade: atividade.dificuldade,
      descricao: atividade.descricao,
      tempoEstimado: atividade.tempoEstimado,
      cor: atividade.cor,
      icone: atividade.icone,
      perguntas: atividade.perguntas,
      respondedores: atividade.respondidas,
    },
    realizada: realizada
      ? {
          acertos: realizada.acertos,
          erros: realizada.erros,
          pontosGanhos: realizada.pontosGanhos,
          createdAt: realizada.createdAt,
        }
      : null,
  });
}