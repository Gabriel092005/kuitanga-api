import { turma } from "@prisma/client";
import { turmaRepository } from "@/repositories/turma-repository";

interface criarTurmaRequest {
  nome: string;
  materia: string;
  professorId: string;
  escolaId: string;
}

interface criarTurmaResponse {
  turma: turma;
}

export class CriarTurmaUseCase {
  constructor(private turmaRepository: turmaRepository) {}

  async execute({ nome, materia, professorId, escolaId }: criarTurmaRequest): Promise<criarTurmaResponse> {
    const turma = await this.turmaRepository.criar({
      nome,
      materia,
      professorId,
      escolaId,
      status: "ativo",
    });

    return { turma };
  }
}