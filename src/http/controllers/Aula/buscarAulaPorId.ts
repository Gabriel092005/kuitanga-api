import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeBuscarAulaPorIdUseCase } from "@/use-cases/factories/makeBuscarAulaPorIdUseCase";

export async function buscarAulaPorId(request: FastifyRequest, reply: FastifyReply) {
  const buscarAulaParamsSchema = z.object({
    id: z.coerce.number().positive(),
  });

  const { id } = buscarAulaParamsSchema.parse(request.params);

  const buscarAulaPorIdUseCase = makeBuscarAulaPorIdUseCase();

  const { aula } = await buscarAulaPorIdUseCase.execute({ id });

  if (!aula) {
    return reply.status(404).send({ message: "aula nao encontrada" });
  }

  return reply.status(200).send({ aula });
}