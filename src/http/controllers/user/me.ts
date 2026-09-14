import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nome: true,
      email: true,
      number: true,
      role: true,
      Aluno: true,
      turmaId: true,
      createdAt: true,
      turma: {
        select: {
          nome: true,
          materia: true,
        },
      },
    },
  });

  if (!user) {
    return reply.status(404).send({ message: "utilizador nao encontrado" });
  }

  return reply.status(200).send({ user });
}