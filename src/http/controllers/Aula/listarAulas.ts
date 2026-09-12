import { FastifyRequest, FastifyReply } from "fastify";
import { makeListarAulasUseCase } from "@/use-cases/factories/makeListarAulasUseCase";

export async function listarAulas(request: FastifyRequest, reply: FastifyReply) {
  const listarAulasUseCase = makeListarAulasUseCase();

  const { aulas } = await listarAulasUseCase.execute();

  return reply.status(200).send({ aulas });
}