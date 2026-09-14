import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { Aluno, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function adicionarAluno(request: FastifyRequest, reply: FastifyReply) {
  const adicionarAlunoParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const adicionarAlunoBodySchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    number: z.string().optional(),
    papel: z.enum(["ALUNO", "RESPONSAVEL"]).default("ALUNO"),
    password: z.string().min(6).default("123456"),
  });

  const { id } = adicionarAlunoParamsSchema.parse(request.params);
  const { nome, email, number, papel, password } = adicionarAlunoBodySchema.parse(request.body);

  const { sub: userId, role } = request.user as { sub: string; role?: string };
  const isAdmin = role === "ADMIN";

  const turma = await prisma.turma.findUnique({
    where: { id },
    select: { id: true, nome: true, escolaId: true, professorId: true },
  });

  if (!turma) {
    return reply.status(404).send({ message: "turma nao encontrada" });
  }

  if (!isAdmin && turma.professorId !== userId) {
    return reply.status(403).send({ message: "essa turma nao pertence ao professor" });
  }

  const emailExistente = await prisma.user.findUnique({ where: { email } });
  if (emailExistente) {
    return reply.status(409).send({ message: "ja existe um utilizador com esse email" });
  }

  const novoAluno = await prisma.user.create({
    data: {
      nome,
      email,
      password_hash: password,
      number: number || "000000000",
      role: Role.MEMBER,
      Aluno: papel as Aluno,
      turmaId: turma.id,
    },
    select: { id: true, nome: true, email: true, Aluno: true },
  });

  await prisma.matricula.create({
    data: {
      userId: novoAluno.id,
      escolaId: turma.escolaId,
      status: "CONFIRMADO",
    },
  });

  return reply.status(201).send({
    message: `${nome} entrou na turma ${turma.nome}`,
    aluno: novoAluno,
  });
}