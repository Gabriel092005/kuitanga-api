import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeSolicitarAulaAoVivoUseCase } from "@/use-cases/factories/makeSolicitarAulaAoVivoUseCase";

export async function solicitarAulaAoVivo(request: FastifyRequest, reply: FastifyReply) {
  const solicitarAulaAoVivoBodySchema = z.object({
    userId: z.string(),
    tema: z.string(),
    materia: z.string(),
    data: z.string(),
    hora: z.string(),
    professor: z.string().optional(),
  });

  const { userId, tema, materia, data, hora, professor } = solicitarAulaAoVivoBodySchema.parse(request.body);

  try {
    const solicitarAulaAoVivoUseCase = makeSolicitarAulaAoVivoUseCase();

    const { aulaAoVivo } = await solicitarAulaAoVivoUseCase.execute({
      userId,
      tema,
      materia,
      data: new Date(data),
      hora,
      professor,
    });

    return reply.status(201).send({
      message: "aula ao vivo solicitada com sucesso",
      aulaAoVivo,
    });
  } catch (error) {
    throw error;
  }
}