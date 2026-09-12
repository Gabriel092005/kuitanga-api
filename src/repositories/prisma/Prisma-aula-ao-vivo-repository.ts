import { Prisma } from "@prisma/client";
import { aulaAoVivoRepository } from "../aula-ao-vivo-repository";
import { prisma } from "@/lib/prisma";

export class PrismaAulaAoVivoRepository implements aulaAoVivoRepository {
  async criar(data: Prisma.aulaAoVivoUncheckedCreateInput) {
    const aulaAoVivo = await prisma.aulaAoVivo.create({
      data,
    });
    return aulaAoVivo;
  }

  async listar() {
    const aulasAoVivo = await prisma.aulaAoVivo.findMany({
      orderBy: [{ data: "asc" }, { hora: "asc" }],
    });
    return aulasAoVivo;
  }
}