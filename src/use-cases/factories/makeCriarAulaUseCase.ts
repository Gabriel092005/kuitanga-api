import { PrismaAulaRepository } from "@/repositories/prisma/Prisma-aula-repository";
import { CriarAulaUseCase } from "../criar-aula";

export function makeCriarAulaUseCase() {
  const aulaRepository = new PrismaAulaRepository();
  const UseCase = new CriarAulaUseCase(aulaRepository);

  return UseCase;
}