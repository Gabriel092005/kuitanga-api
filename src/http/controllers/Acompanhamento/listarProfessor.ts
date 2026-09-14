import { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { computarConquistas } from "@/http/controllers/Conquista/computarConquistas";

type AlunoComProgresso = {
  id: string;
  nome: string;
  email: string;
  turmaId: string;
  turma: string;
  progresso: number;
  atividades: number;
  pontos: number;
  conquistas: number;
  totalDeConquistas: number;
};

export async function listaAcompanhamentoProfessor(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId, role } = request.user as { sub: string; role: string };

  if (role !== Role.PROFESSOR) {
    return reply.status(403).send({ message: "apenas professores podem aceder a este recurso" });
  }

  const turmas = await prisma.turma.findMany({
    where: { professorId: userId, status: "ativo" },
    include: {
      alunos: {
        include: { matricula: true, turma: true },
        orderBy: { nome: "asc" },
      },
    },
    orderBy: { nome: "asc" },
  });

  const alunoIds = turmas.flatMap((t) => t.alunos.map((a) => a.id));

  let resumoPorAluno: Record<string, { atividades: number; pontos: number }> = {};
  if (alunoIds.length) {
    const agrupados = await prisma.atividade_realizada.groupBy({
      by: ["userId"],
      where: { userId: { in: alunoIds } },
      _count: { _all: true },
      _sum: { pontosGanhos: true },
    });
    resumoPorAluno = Object.fromEntries(
      agrupados.map((g) => [
        g.userId,
        { atividades: g._count._all, pontos: g._sum.pontosGanhos || 0 },
      ])
    );
  }

  const alunos: AlunoComProgresso[] = [];
  for (const turma of turmas) {
    for (const aluno of turma.alunos) {
      const c = await computarConquistas(aluno);
      const resumo = resumoPorAluno[aluno.id] || { atividades: 0, pontos: 0 };
      const progresso = c.medalhas.length
        ? Math.round((c.conquistasDesbloqueadas / c.medalhas.length) * 100)
        : 0;
      alunos.push({
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
        turmaId: turma.id,
        turma: turma.nome,
        progresso,
        atividades: resumo.atividades,
        pontos: resumo.pontos,
        conquistas: c.conquistasDesbloqueadas,
        totalDeConquistas: c.medalhas.length,
      });
    }
  }

  alunos.sort((a, b) => a.nome.localeCompare(b.nome));

  const metricas = {
    alunosAtivos: alunos.length,
    atividadesConcluidas: alunos.reduce((soma, a) => soma + a.atividades, 0),
    totalPontos: alunos.reduce((soma, a) => soma + a.pontos, 0),
    taxaConclusao: alunos.length
      ? Math.round(alunos.reduce((soma, a) => soma + a.progresso, 0) / alunos.length)
      : 0,
  };

  const desempenhoTurmas = turmas.map((turma) => {
    const daTurma = alunos.filter((a) => a.turmaId === turma.id);
    return {
      id: turma.id,
      nome: turma.nome,
      materia: turma.materia,
      alunos: daTurma.length,
      media: daTurma.length
        ? Math.round(daTurma.reduce((soma, a) => soma + a.progresso, 0) / daTurma.length)
        : 0,
    };
  });

  return reply.status(200).send({
    metricas,
    turmas: desempenhoTurmas,
    alunos,
  });
}