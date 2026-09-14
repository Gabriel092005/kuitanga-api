import { Prisma } from "@prisma/client";
import { aulaRepository, listarAulasParams } from "../aula-repository";
import { prisma } from "@/lib/prisma";

export class PrismaAulaRepository implements aulaRepository {
  async listar({ professorId, turmaId }: listarAulasParams = {}) {
    const where: Prisma.aulaWhereInput = { videoUrl: { not: null } };
    if (professorId) where.userId = professorId;
    else if (turmaId) where.turmaId = turmaId;
    const aulas = await prisma.aula.findMany({
      where,
      orderBy: { id: "asc" },
    });
    return aulas;
  }

  async buscarPorId(id: number) {
    const aula = await prisma.aula.findUnique({
      where: { id },
    });
    return aula;
  }

  async criar(data: Prisma.aulaUncheckedCreateInput) {
    const aula = await prisma.aula.create({
      data,
    });
    return aula;
  }

  async deletar(id: number) {
    await prisma.aula.delete({
      where: { id },
    });
  }
}