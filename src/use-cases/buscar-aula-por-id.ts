import { aula } from "@prisma/client";
import { aulaRepository } from "@/repositories/aula-repository";

interface buscarAulaPorIdRequest {
  id: number;
}

interface buscarAulaPorIdResponse {
  aula: aula | null;
}

export class BuscarAulaPorIdUseCase {
  constructor(private aulaRepository: aulaRepository) {}

  async execute({ id }: buscarAulaPorIdRequest): Promise<buscarAulaPorIdResponse> {
    const aula = await this.aulaRepository.buscarPorId(id);

    return { aula };
  }
}