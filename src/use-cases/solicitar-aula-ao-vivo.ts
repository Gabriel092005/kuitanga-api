import { aulaAoVivo } from "@prisma/client";
import { aulaAoVivoRepository } from "@/repositories/aula-ao-vivo-repository";

interface solicitarAulaAoVivoRequest {
  userId: string;
  tema: string;
  materia: string;
  data: Date;
  hora: string;
  professor?: string;
}

interface solicitarAulaAoVivoResponse {
  aulaAoVivo: aulaAoVivo;
}

export class SolicitarAulaAoVivoUseCase {
  constructor(private aulaAoVivoRepository: aulaAoVivoRepository) {}

  async execute({
    userId,
    tema,
    materia,
    data,
    hora,
    professor,
  }: solicitarAulaAoVivoRequest): Promise<solicitarAulaAoVivoResponse> {
    const aulaAoVivo = await this.aulaAoVivoRepository.criar({
      userId,
      tema,
      materia,
      data,
      hora,
      professor: professor || "A confirmar",
    });

    return { aulaAoVivo };
  }
}