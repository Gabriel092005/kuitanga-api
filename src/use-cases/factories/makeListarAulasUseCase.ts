import { PrismaAulaRepository } from "@/repositories/prisma/Prisma-aula-repository";
import { ListarAulasUseCase } from "../listar-aulas";

export function makeListarAulasUseCase() {
  const aulaRepository = new PrismaAulaRepository();
  const UseCase = new ListarAulasUseCase(aulaRepository);

  return UseCase;
}