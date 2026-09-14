import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { makeEntrarTurmaUseCase } from "@/use-cases/factories/makeEntrarTurmaUseCase";
import { makeCriarNotificacaoUseCase } from "@/use-cases/factories/makeCriarNotificacaoUseCase";
import { escolaDoUsuario } from "../Aula/escolaDoUsuario";

export async function entrarTurma(request: FastifyRequest, reply: FastifyReply) {
  const entrarTurmaParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = entrarTurmaParamsSchema.parse(request.params);
  const { sub: userId } = request.user as { sub: string };

  const turma = await prisma.turma.findUnique({ where: { id } });
  if (!turma) {
    return reply.status(404).send({ message: "turma nao encontrada" });
  }
  if (turma.status !== "ativo") {
    return reply.status(400).send({ message: "esta turma nao aceita inscricoes" });
  }

  const escolaId = await escolaDoUsuario(userId);
  if (!escolaId || escolaId !== turma.escolaId) {
    return reply.status(400).send({ message: "esta turma nao pertence a tua escola" });
  }

  const entrarTurmaUseCase = makeEntrarTurmaUseCase();

  await entrarTurmaUseCase.execute({ userId, turmaId: id });

  const aluno = await prisma.user.findUnique({
    where: { id: userId },
    select: { nome: true },
  });

  const criarNotificacaoUseCase = makeCriarNotificacaoUseCase();
  const nomeAluno = aluno?.nome ?? "Um aluno";

  await criarNotificacaoUseCase.execute({
    userId: turma.professorId,
    content: `O aluno ${nomeAluno} entrou na sua turma ${turma.nome}`,
  });

  const admins = await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: { id: true },
  });

  await Promise.all(
    admins.map((admin) =>
      criarNotificacaoUseCase.execute({
        userId: admin.id,
        content: `${nomeAluno} entrou na turma ${turma.nome}`,
      })
    )
  );

  return reply.status(200).send({
    message: "entraste na turma com sucesso",
    turma,
  });
}