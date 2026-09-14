import { FastifyRequest, FastifyReply } from "fastify";
import { makeListarAulasUseCase } from "@/use-cases/factories/makeListarAulasUseCase";
import { prisma } from "@/lib/prisma";

export async function listarAulas(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, turmaId: true },
  });

  const listarAulasUseCase = makeListarAulasUseCase();

  const { aulas } = await listarAulasUseCase.execute({
    role: user?.role ?? "MEMBER",
    userId,
    turmaId: user?.turmaId ?? null,
  });

  return reply.status(200).send({ aulas });
}