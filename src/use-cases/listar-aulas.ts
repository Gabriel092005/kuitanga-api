import { aula } from "@prisma/client";
import { aulaRepository } from "@/repositories/aula-repository";

interface listarAulasResponse {
  aulas: aula[];
}

export class ListarAulasUseCase {
  constructor(private aulaRepository: aulaRepository) {}

  async execute(): Promise<listarAulasResponse> {
    const aulas = await this.aulaRepository.listar();

    return { aulas };
  }
}