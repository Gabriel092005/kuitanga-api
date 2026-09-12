import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCriarAulaUseCase } from "@/use-cases/factories/makeCriarAulaUseCase";

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
  });

  const { titulo, professor, materia, duracao, descricao, topicos, data, thumbnail, visualizacoes } =
    criarAulaBodySchema.parse(request.body);

  try {
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
    });

    return reply.status(201).send({
      message: "aula criada com sucesso",
      aula,
    });
  } catch (error) {
    throw error;
  }
}