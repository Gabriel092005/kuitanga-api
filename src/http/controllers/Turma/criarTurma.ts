import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCriarTurmaUseCase } from "@/use-cases/factories/makeCriarTurmaUseCase";
import { escolaDoUsuario } from "../Aula/escolaDoUsuario";

export async function criarTurma(request: FastifyRequest, reply: FastifyReply) {
  const criarTurmaBodySchema = z.object({
    nome: z.string().min(1),
    materia: z.string().min(1),
  });

  const { nome, materia } = criarTurmaBodySchema.parse(request.body);

  const { sub: userId } = request.user as { sub: string };

  const escolaId = await escolaDoUsuario(userId);
  if (!escolaId) {
    return reply.status(400).send({ message: "utilizador sem matricula ativa" });
  }

  const criarTurmaUseCase = makeCriarTurmaUseCase();

  const { turma } = await criarTurmaUseCase.execute({
    nome,
    materia,
    professorId: userId,
    escolaId,
  });

  return reply.status(201).send({
    message: "turma criada com sucesso",
    turma,
  });
}