import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { computarConquistas } from "./computarConquistas";

export async function listarConquistas(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      matricula: true,
      turma: true,
    },
  });

  if (!user) {
    return reply.status(404).send({ message: "utilizador nao encontrado" });
  }

  const conquistas = await computarConquistas(user);

  return reply.status(200).send({ conquistas });
}