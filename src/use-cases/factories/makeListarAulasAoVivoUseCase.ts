import { PrismaAulaAoVivoRepository } from "@/repositories/prisma/Prisma-aula-ao-vivo-repository";
import { ListarAulasAoVivoUseCase } from "../listar-aulas-ao-vivo";

export function makeListarAulasAoVivoUseCase() {
  const aulaAoVivoRepository = new PrismaAulaAoVivoRepository();
  const UseCase = new ListarAulasAoVivoUseCase(aulaAoVivoRepository);

  return UseCase;
}