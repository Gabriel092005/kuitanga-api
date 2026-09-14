import { aulaRepository } from "@/repositories/aula-repository";

interface deletarAulaRequest {
  id: number;
}

export class DeletarAulaUseCase {
  constructor(private aulaRepository: aulaRepository) {}

  async execute({ id }: deletarAulaRequest): Promise<void> {
    await this.aulaRepository.deletar(id);
  }
}