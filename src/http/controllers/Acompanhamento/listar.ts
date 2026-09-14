import { FastifyRequest, FastifyReply } from "fastify";
import { Aluno, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { computarConquistas } from "@/http/controllers/Conquista/computarConquistas";

export async function listaAcompanhamento(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };

  const responsavel = await prisma.user.findUnique({
    where: { id: userId },
    include: { matricula: true },
  });

  if (!responsavel) {
    return reply.status(404).send({ message: "utilizador nao encontrado" });
  }

  const escolaIds = responsavel.matricula.map((m) => m.escolaId);

  const filhos = await prisma.user.findMany({
    where: {
      Aluno: Aluno.ALUNO,
      role: Role.MEMBER,
      matricula: escolaIds.length ? { some: { escolaId: { in: escolaIds } } } : undefined,
    },
    include: {
      matricula: true,
      turma: true,
    },
    orderBy: { nome: "asc" },
  });

  const resultado = [];
  for (const filho of filhos) {
    const c = await computarConquistas(filho);
    resultado.push({
      id: filho.id,
      nome: filho.nome,
      email: filho.email,
      turma: c.turma,
      totalAulas: c.totalAulas,
      visualizacoesTotal: c.visualizacoesTotal,
      atividadesRealizadas: c.atividadesRealizadas,
      pontosAtividades: c.pontosAtividades,
      aulasAoVivoAgendadas: c.aulasAoVivoAgendadas,
      conquistasDesbloqueadas: c.conquistasDesbloqueadas,
      totalDeConquistas: c.medalhas.length,
      progresso: c.medalhas.length
        ? Math.round((c.conquistasDesbloqueadas / c.medalhas.length) * 100)
        : 0,
      aulas: c.aulas,
    });
  }

  return reply.status(200).send({
    responsavel: { nome: responsavel.nome, email: responsavel.email },
    filhos: resultado,
  });
}