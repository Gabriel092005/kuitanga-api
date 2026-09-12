import { aulaAoVivo } from "@prisma/client";
import { aulaAoVivoRepository } from "@/repositories/aula-ao-vivo-repository";

interface listarAulasAoVivoResponse {
  aulasAoVivo: aulaAoVivo[];
}

export class ListarAulasAoVivoUseCase {
  constructor(private aulaAoVivoRepository: aulaAoVivoRepository) {}

  async execute(): Promise<listarAulasAoVivoResponse> {
    const aulasAoVivo = await this.aulaAoVivoRepository.listar();

    return { aulasAoVivo };
  }
}