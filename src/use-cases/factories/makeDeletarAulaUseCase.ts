import { PrismaAulaRepository } from "@/repositories/prisma/Prisma-aula-repository";
import { DeletarAulaUseCase } from "../deletar-aula";

export function makeDeletarAulaUseCase() {
  const aulaRepository = new PrismaAulaRepository();
  const UseCase = new DeletarAulaUseCase(aulaRepository);

  return UseCase;
}