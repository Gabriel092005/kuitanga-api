import { PrismaAulaRepository } from "@/repositories/prisma/Prisma-aula-repository";
import { BuscarAulaPorIdUseCase } from "../buscar-aula-por-id";

export function makeBuscarAulaPorIdUseCase() {
  const aulaRepository = new PrismaAulaRepository();
  const UseCase = new BuscarAulaPorIdUseCase(aulaRepository);

  return UseCase;
}