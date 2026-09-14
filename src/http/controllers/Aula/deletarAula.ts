import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeDeletarAulaUseCase } from "@/use-cases/factories/makeDeletarAulaUseCase";

export async function deletarAula(request: FastifyRequest, reply: FastifyReply) {
  const deletarAulaParamsSchema = z.object({
    id: z.coerce.number().positive(),
  });

  const { id } = deletarAulaParamsSchema.parse(request.params);

  try {
    const deletarAulaUseCase = makeDeletarAulaUseCase();
    await deletarAulaUseCase.execute({ id });
  } catch {
    return reply.status(404).send({ message: "aula nao encontrada" });
  }

  return reply.status(200).send({ message: "aula eliminada" });
}