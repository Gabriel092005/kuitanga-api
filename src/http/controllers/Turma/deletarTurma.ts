import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";

export async function deletarTurma(request: FastifyRequest, reply: FastifyReply) {
  const deletarTurmaParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = deletarTurmaParamsSchema.parse(request.params);

  const { sub: userId, role } = request.user as { sub: string; role?: string };

  const turma = await prisma.turma.findUnique({ where: { id } });
  if (!turma) {
    return reply.status(404).send({ message: "turma nao encontrada" });
  }

  const isAdmin = role === "ADMIN";
  if (!isAdmin && turma.professorId !== userId) {
    return reply.status(403).send({ message: "so o professor da turma pode eliminar a turma" });
  }

  await prisma.turma.delete({ where: { id } });

  return reply.status(200).send({ message: "turma eliminada" });
}