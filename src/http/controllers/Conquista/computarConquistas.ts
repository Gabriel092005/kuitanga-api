import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { makeListarAulasUseCase } from "@/use-cases/factories/makeListarAulasUseCase";

const DIAS_MS = 86400000;

type UsuarioComTurma = Prisma.UserGetPayload<{
  include: { matricula: true; turma: true };
}>;

export async function computarConquistas(user: UsuarioComTurma) {
  const userId = user.id;

  const numAulasAoVivoAgendadas = await prisma.aulaAoVivo.count({ where: { userId } });
  const numFeedbacks = await prisma.feedback.count({ where: { userId } });
  const numAtividadesRealizadas = await prisma.atividade_realizada.count({ where: { userId } });

  const listarAulasUseCase = makeListarAulasUseCase();
  const { aulas } = await listarAulasUseCase.execute({
    role: user.role,
    userId,
    turmaId: user.turmaId,
  });

  const visualizacoesTotal = aulas.reduce((soma, a) => soma + (a.visualizacoes || 0), 0);
  const diasNaPlataforma = Math.max(1, Math.floor((Date.now() - user.createdAt.getTime()) / DIAS_MS) + 1);

  const matriculaConfirmada = user.matricula.some((m) => m.status === "CONFIRMADO");
  const temTurma = !!user.turma;

  const regras = [
    {
      id: 1,
      nome: "Aluno Matriculado",
      descricao: "Faz a matricula confirmada na escola",
      atual: matriculaConfirmada ? 1 : 0,
      meta: 1,
      desbloqueada: matriculaConfirmada,
    },
    {
      id: 2,
      nome: "Em Plena Turma",
      descricao: "Junta-te a uma turma",
      atual: temTurma ? 1 : 0,
      meta: 1,
      desbloqueada: temTurma,
    },
    {
      id: 3,
      nome: "Explorador de Aulas",
      descricao: "Tens aulas para estudar na tua turma",
      atual: Math.min(aulas.length, 1),
      meta: 1,
      desbloqueada: aulas.length >= 1,
    },
    {
      id: 4,
      nome: "Ao Vivo",
      descricao: "Agenda uma aula ao vivo",
      atual: Math.min(numAulasAoVivoAgendadas, 1),
      meta: 1,
      desbloqueada: numAulasAoVivoAgendadas >= 1,
    },
    {
      id: 5,
      nome: "Voz Activa",
      descricao: "Deixa um feedback",
      atual: Math.min(numFeedbacks, 1),
      meta: 1,
      desbloqueada: numFeedbacks >= 1,
    },
    {
      id: 6,
      nome: "Veterano",
      descricao: "Completa 30 dias na plataforma",
      atual: Math.min(diasNaPlataforma, 30),
      meta: 30,
      desbloqueada: diasNaPlataforma >= 30,
    },
    {
      id: 7,
      nome: "Mente Brilhante",
      descricao: "Completa a primeira atividade",
      atual: Math.min(numAtividadesRealizadas, 1),
      meta: 1,
      desbloqueada: numAtividadesRealizadas >= 1,
    },
  ];

  const conquistasDesbloqueadas = regras.filter((r) => r.desbloqueada).length;

  return {
    nome: user.nome,
    turma: user.turma
      ? {
          id: user.turma.id,
          nome: user.turma.nome,
          materia: user.turma.materia,
          status: user.turma.status,
        }
      : null,
    matriculas: user.matricula.length,
    matriculaConfirmada,
    totalAulas: aulas.length,
    visualizacoesTotal,
    aulasAoVivoAgendadas: numAulasAoVivoAgendadas,
    feedbacks: numFeedbacks,
    diasNaPlataforma,
    conquistasDesbloqueadas,
    medalhas: regras.map(({ id, nome, descricao, atual, meta, desbloqueada }) => ({
      id,
      nome,
      descricao,
      atual,
      meta,
      desbloqueada,
    })),
    aulas: aulas.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      materia: a.materia,
      professor: a.professor,
      duracao: a.duracao,
      visualizacoes: a.visualizacoes,
    })),
  };
}