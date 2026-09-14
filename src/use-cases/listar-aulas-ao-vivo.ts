import { aulaAoVivo, Role } from "@prisma/client";
import { aulaAoVivoRepository } from "@/repositories/aula-ao-vivo-repository";

interface listarAulasAoVivoRequest {
  role: Role;
  userId: string;
  turmaId?: string | null;
}

interface listarAulasAoVivoResponse {
  aulasAoVivo: aulaAoVivo[];
}

export class ListarAulasAoVivoUseCase {
  constructor(private aulaAoVivoRepository: aulaAoVivoRepository) {}

  async execute({ role, userId, turmaId }: listarAulasAoVivoRequest): Promise<listarAulasAoVivoResponse> {
    let aulasAoVivo: aulaAoVivo[];

    if (role === Role.PROFESSOR) {
      aulasAoVivo = await this.aulaAoVivoRepository.listar({ professorId: userId });
    } else if (role === Role.ADMIN) {
      aulasAoVivo = await this.aulaAoVivoRepository.listar();
    } else if (turmaId) {
      aulasAoVivo = await this.aulaAoVivoRepository.listar({ turmaId });
    } else {
      aulasAoVivo = await this.aulaAoVivoRepository.listar({ userId });
    }

    return { aulasAoVivo };
  }
}