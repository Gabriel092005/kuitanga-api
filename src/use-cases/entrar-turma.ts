import { turmaRepository } from "@/repositories/turma-repository";

interface entrarTurmaRequest {
  userId: string;
  turmaId: string;
}

export class EntrarTurmaUseCase {
  constructor(private turmaRepository: turmaRepository) {}

  async execute({ userId, turmaId }: entrarTurmaRequest) {
    await this.turmaRepository.inscreverAluno(userId, turmaId);
  }
}