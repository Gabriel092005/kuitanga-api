import { Role, turma } from "@prisma/client";
import { turmaRepository } from "@/repositories/turma-repository";

interface listarTurmasRequest {
  role: Role;
  professorId: string;
  escolaId: string | null;
}

interface listarTurmasResponse {
  turmas: turma[];
}

export class ListarTurmasUseCase {
  constructor(private turmaRepository: turmaRepository) {}

  async execute({ role, professorId, escolaId }: listarTurmasRequest): Promise<listarTurmasResponse> {
    let turmas: turma[];

    if (role === Role.ADMIN) {
      turmas = await this.turmaRepository.listarTodas();
    } else if (role === Role.PROFESSOR) {
      turmas = await this.turmaRepository.listarPorProfessor(professorId);
    } else if (escolaId) {
      turmas = await this.turmaRepository.listarPorEscola(escolaId);
    } else {
      turmas = [];
    }

    return { turmas };
  }
}