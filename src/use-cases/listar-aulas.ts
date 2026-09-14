import { aula, Role } from "@prisma/client";
import { aulaRepository } from "@/repositories/aula-repository";

interface listarAulasRequest {
  role: Role;
  userId: string;
  turmaId?: string | null;
}

interface listarAulasResponse {
  aulas: aula[];
}

export class ListarAulasUseCase {
  constructor(private aulaRepository: aulaRepository) {}

  async execute({ role, userId, turmaId }: listarAulasRequest): Promise<listarAulasResponse> {
    let aulas: aula[];

    if (role === Role.PROFESSOR) {
      aulas = await this.aulaRepository.listar({ professorId: userId });
    } else if (role === Role.ADMIN) {
      aulas = await this.aulaRepository.listar();
    } else if (turmaId) {
      aulas = await this.aulaRepository.listar({ turmaId });
    } else {
      aulas = [];
    }

    return { aulas };
  }
}