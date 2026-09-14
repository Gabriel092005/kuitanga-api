import { PrismaTurmaRepository } from "@/repositories/prisma/Prisma-turma-repository";
import { CriarTurmaUseCase } from "../criar-turma";

export function makeCriarTurmaUseCase() {
  const turmaRepository = new PrismaTurmaRepository();
  const useCase = new CriarTurmaUseCase(turmaRepository);

  return useCase;
}