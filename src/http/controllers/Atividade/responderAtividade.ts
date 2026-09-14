import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

const responderBodySchema = z.object({
  acertos: z.number().int().nonnegative(),
  erros: z.number().int().nonnegative(),
});

export async function responderAtividade(request: FastifyRequest, reply: FastifyReply) {
  const responderParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const { id } = responderParamsSchema.parse(request.params);
  const { acertos, erros } = responderBodySchema.parse(request.body);
  const { sub: userId } = request.user as { sub: string };

  const atividade = await prisma.atividade.findUnique({ where: { id } });
  if (!atividade) {
    return reply.status(404).send({ message: "atividade nao encontrada" });
  }

  const perguntas = Array.isArray(atividade.perguntas) ? atividade.perguntas : [];
  const total = perguntas.length;
  const pontosGanhos = total > 0 ? Math.round((acertos / total) * atividade.pontos) : 0;

  const existente = await prisma.atividade_realizada.findUnique({
    where: { atividadeId_userId: { atividadeId: id, userId } },
  });

  await prisma.atividade_realizada.upsert({
    where: { atividadeId_userId: { atividadeId: id, userId } },
    create: {
      atividadeId: id,
      userId,
      acertos,
      erros,
      pontosGanhos,
    },
    update: {
      acertos,
      erros,
      pontosGanhos,
    },
  });

  if (!existente) {
    await prisma.atividade.update({
      where: { id },
      data: { respondidas: { increment: 1 } },
    });
  }

  return reply.status(200).send({
    message: "respostas registadas",
    acertos,
    erros,
    total,
    pontos: pontosGanhos,
  });
}