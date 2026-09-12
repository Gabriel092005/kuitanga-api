import { Prisma } from "@prisma/client";
import { aulaRepository } from "../aula-repository";
import { prisma } from "@/lib/prisma";

export class PrismaAulaRepository implements aulaRepository {
  async listar() {
    const aulas = await prisma.aula.findMany({
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
}