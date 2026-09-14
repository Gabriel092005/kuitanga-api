import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCriarAulaUseCase } from "@/use-cases/factories/makeCriarAulaUseCase";
import { escolaDoUsuario } from "./escolaDoUsuario";
import { prisma } from "@/lib/prisma";

export async function criarAula(request: FastifyRequest, reply: FastifyReply) {
  const criarAulaBodySchema = z.object({
    titulo: z.string(),
    professor: z.string(),
    materia: z.string(),
    duracao: z.string(),
    descricao: z.string(),
    topicos: z.array(z.string()).default([]),
    data: z.string().optional(),
    thumbnail: z.string().optional(),
    visualizacoes: z.number().optional(),
    videoUrl: z.string(),
    turmaId: z.string().optional(),
  });

  const { titulo, professor, materia, duracao, descricao, topicos, data, thumbnail, visualizacoes, videoUrl, turmaId } =
    criarAulaBodySchema.parse(request.body);

  try {
    const { sub: userId, role } = request.user as { sub: string; role?: string };
    const isAdmin = role === "ADMIN";

    if (turmaId) {
      const turma = await prisma.turma.findUnique({ where: { id: turmaId } });
      if (!turma) {
        return reply.status(404).send({ message: "turma nao encontrada" });
      }
      if (!isAdmin && turma.professorId !== userId) {
        return reply.status(400).send({ message: "essa turma nao pertence ao professor" });
      }
    }

    const escolaId = await escolaDoUsuario(userId);

    const criarAulaUseCase = makeCriarAulaUseCase();

    const { aula } = await criarAulaUseCase.execute({
      titulo,
      professor,
      materia,
      duracao,
      descricao,
      topicos,
      data,
      thumbnail,
      visualizacoes,
      videoUrl,
      turmaId,
      userId,
      escolaId,
    });

    return reply.status(201).send({
      message: "aula criada com sucesso",
      aula,
    });
  } catch (error) {
    throw error;
  }
}