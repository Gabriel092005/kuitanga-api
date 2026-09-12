import { PrismaAulaAoVivoRepository } from "@/repositories/prisma/Prisma-aula-ao-vivo-repository";
import { SolicitarAulaAoVivoUseCase } from "../solicitar-aula-ao-vivo";

export function makeSolicitarAulaAoVivoUseCase() {
  const aulaAoVivoRepository = new PrismaAulaAoVivoRepository();
  const UseCase = new SolicitarAulaAoVivoUseCase(aulaAoVivoRepository);

  return UseCase;
}