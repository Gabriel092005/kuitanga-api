import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

export async function deletarAtividade(request: FastifyRequest, reply: FastifyReply) {
  const deletarAtividadeParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const { id } = deletarAtividadeParamsSchema.parse(request.params);

  const { sub: userId, role } = request.user as { sub: string; role?: string };

  const atividade = await prisma.atividade.findUnique({ where: { id } });
  if (!atividade) {
    return reply.status(404).send({ message: "atividade nao encontrada" });
  }

  const isAdmin = role === "ADMIN";
  if (!isAdmin && atividade.userId !== userId) {
    return reply.status(403).send({ message: "so o professor autor pode eliminar a atividade" });
  }

  await prisma.atividade.delete({ where: { id } });

  return reply.status(200).send({ message: "atividade eliminada" });
}