import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

export async function buscarTurma(request: FastifyRequest, reply: FastifyReply) {
  const buscarTurmaParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = buscarTurmaParamsSchema.parse(request.params);

  const turma = await prisma.turma.findUnique({
    where: { id },
    include: {
      professor: { select: { nome: true } },
      escola: { select: { name: true } },
      alunos: {
        select: { id: true, nome: true, email: true, Aluno: true },
        orderBy: { nome: "asc" },
      },
    },
  });

  if (!turma) {
    return reply.status(404).send({ message: "turma nao encontrada" });
  }

  return reply.status(200).send({ turma });
}