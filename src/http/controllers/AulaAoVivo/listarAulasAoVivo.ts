import { FastifyRequest, FastifyReply } from "fastify";
import { makeListarAulasAoVivoUseCase } from "@/use-cases/factories/makeListarAulasAoVivoUseCase";

export async function listarAulasAoVivo(request: FastifyRequest, reply: FastifyReply) {
  const listarAulasAoVivoUseCase = makeListarAulasAoVivoUseCase();

  const { aulasAoVivo } = await listarAulasAoVivoUseCase.execute();

  return reply.status(200).send({ aulasAoVivo });
}