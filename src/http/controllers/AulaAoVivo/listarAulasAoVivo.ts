import { FastifyRequest, FastifyReply } from "fastify";
import { makeListarAulasAoVivoUseCase } from "@/use-cases/factories/makeListarAulasAoVivoUseCase";
import { prisma } from "@/lib/prisma";

export async function listarAulasAoVivo(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, turmaId: true },
  });

  const listarAulasAoVivoUseCase = makeListarAulasAoVivoUseCase();

  const { aulasAoVivo } = await listarAulasAoVivoUseCase.execute({
    role: user?.role ?? "MEMBER",
    userId,
    turmaId: user?.turmaId ?? null,
  });

  return reply.status(200).send({ aulasAoVivo });
}