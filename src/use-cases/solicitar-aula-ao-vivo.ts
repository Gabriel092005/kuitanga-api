import { aulaAoVivo, Role } from "@prisma/client";
import { aulaAoVivoRepository } from "@/repositories/aula-ao-vivo-repository";
import { prisma } from "@/lib/prisma";

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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, turmaId: true },
    });

    let turmaId = user?.turmaId ?? null;
    if (user?.role === Role.PROFESSOR) {
      const primeiraTurma = await prisma.turma.findFirst({
        where: { professorId: userId },
        select: { id: true },
      });
      turmaId = primeiraTurma?.id ?? null;
    }

    const aulaAoVivo = await this.aulaAoVivoRepository.criar({
      userId,
      tema,
      materia,
      data,
      hora,
      professor: professor || "A confirmar",
      turmaId,
    });

    return { aulaAoVivo };
  }
}