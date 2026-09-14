import { aula } from "@prisma/client";
import { aulaRepository } from "@/repositories/aula-repository";

interface criarAulaRequest {
  titulo: string;
  professor: string;
  materia: string;
  duracao: string;
  descricao: string;
  topicos: string[];
  data?: string;
  thumbnail?: string;
visualizacoes?: number;
  videoUrl?: string;
  userId?: string;
  escolaId?: string | null;
  turmaId?: string | null;
}

interface criarAulaResponse {
  aula: aula;
}

export class CriarAulaUseCase {
  constructor(private aulaRepository: aulaRepository) {}

  async execute({
    titulo,
    professor,
    materia,
    duracao,
    descricao,
    topicos,
    data,
    thumbnail,
    visualizacoes,
videoUrl,
    userId,
    escolaId,
    turmaId,
  }: criarAulaRequest): Promise<criarAulaResponse> {
    const aula = await this.aulaRepository.criar({
      titulo,
      professor,
      materia,
      duracao,
      descricao,
      topicos,
      data: data || "1 Set 2026",
      thumbnail: thumbnail || "azul",
      visualizacoes: visualizacoes || 0,
videoUrl,
      userId,
      escolaId,
      turmaId,
    });

    return { aula };
  }
}