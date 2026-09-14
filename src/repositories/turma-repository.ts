import { turma, User, Prisma } from "@prisma/client";

export interface listarTurmasParams {
  professorId?: string;
  escolaId?: string;
}

export interface turmaRepository {
  listarPorProfessor(professorId: string): Promise<turma[]>;
  listarTodas(): Promise<turma[]>;
  listarPorEscola(escolaId: string): Promise<turma[]>;
  buscarPorId(id: string): Promise<(turma & { escolaId: string; professorId: string }) | null>;
  criar(data: Prisma.turmaUncheckedCreateInput): Promise<turma>;
  inscreverAluno(userId: string, turmaId: string): Promise<User>;
}