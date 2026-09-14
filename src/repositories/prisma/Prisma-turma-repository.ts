import { Prisma } from "@prisma/client";
import { turmaRepository } from "../turma-repository";
import { prisma } from "@/lib/prisma";

export class PrismaTurmaRepository implements turmaRepository {
  async listarPorProfessor(professorId: string) {
    const turmas = await prisma.turma.findMany({
      where: { professorId, status: "ativo" },
      include: {
        escola: { select: { name: true } },
        _count: { select: { alunos: true } },
      },
      orderBy: { nome: "asc" },
    });
    return turmas;
  }

  async listarTodas() {
    const turmas = await prisma.turma.findMany({
      where: { status: "ativo" },
      include: {
        escola: { select: { name: true } },
        _count: { select: { alunos: true } },
      },
      orderBy: { nome: "asc" },
    });
    return turmas;
  }

  async listarPorEscola(escolaId: string) {
    const turmas = await prisma.turma.findMany({
      where: { escolaId, status: "ativo" },
      include: {
        escola: { select: { name: true } },
        professor: { select: { nome: true } },
        _count: { select: { alunos: true } },
      },
      orderBy: { nome: "asc" },
    });
    return turmas;
  }

  async buscarPorId(id: string) {
    const turma = await prisma.turma.findUnique({ where: { id } });
    return turma;
  }

  async criar(data: Prisma.turmaUncheckedCreateInput) {
    const turma = await prisma.turma.create({ data });
    return turma;
  }

  async inscreverAluno(userId: string, turmaId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { turmaId },
    });
  }
}