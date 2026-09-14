import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { escolaDoUsuario } from "../Aula/escolaDoUsuario";

const perguntaSchema = z.object({
  pergunta: z.string().min(1),
  expressao: z.string().optional(),
  opcoes: z.array(z.string()).min(2),
  resposta: z.number().int().nonnegative(),
});

const criarAtividadeBodySchema = z.object({
  titulo: z.string().min(1),
  materia: z.string().min(1),
  pontos: z.number().int().nonnegative().default(10),
  dificuldade: z.string().default("Facil"),
  descricao: z.string().default(""),
  tempoEstimado: z.string().default("10 min"),
  cor: z.string().default("azul"),
  icone: z.string().default("file"),
  turmaId: z.string().uuid().optional(),
  perguntas: z.array(perguntaSchema).min(1),
});

export async function criarAtividade(request: FastifyRequest, reply: FastifyReply) {
  const { titulo, materia, pontos, dificuldade, descricao, tempoEstimado, cor, icone, turmaId, perguntas } =
    criarAtividadeBodySchema.parse(request.body);

  const { sub: userId, role } = request.user as { sub: string; role?: string };

  const isAdmin = role === "ADMIN";
  if (role !== "PROFESSOR" && !isAdmin) {
    return reply.status(403).send({ message: "so professores podem criar atividades" });
  }

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
  if (!escolaId) {
    return reply.status(400).send({ message: "utilizador sem matricula ativa" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { nome: true },
  });

  const atividade = await prisma.atividade.create({
    data: {
      titulo,
      materia,
      pontos,
      dificuldade,
      descricao,
      tempoEstimado,
      cor,
      icone,
      turmaId,
      perguntas: perguntas as unknown as object,
      userId,
      escolaId,
      professor: user?.nome ?? "",
    },
  });

  return reply.status(201).send({
    message: "atividade criada com sucesso",
    atividade,
  });
}