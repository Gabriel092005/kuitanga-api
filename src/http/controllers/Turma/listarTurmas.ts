import { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { makeListarTurmasUseCase } from "@/use-cases/factories/makeListarTurmasUseCase";
import { escolaDoUsuario } from "../Aula/escolaDoUsuario";

export async function listarTurmas(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId, role } = request.user as { sub: string; role?: string };

  const escolaId = await escolaDoUsuario(userId);

  const listarTurmasUseCase = makeListarTurmasUseCase();

  const { turmas } = await listarTurmasUseCase.execute({
    role: (role as Role) ?? Role.MEMBER,
    professorId: userId,
    escolaId,
  });

  return reply.status(200).send({ turmas });
}