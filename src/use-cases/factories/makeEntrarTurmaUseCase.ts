import { PrismaTurmaRepository } from "@/repositories/prisma/Prisma-turma-repository";
import { EntrarTurmaUseCase } from "../entrar-turma";

export function makeEntrarTurmaUseCase() {
  const turmaRepository = new PrismaTurmaRepository();
  const useCase = new EntrarTurmaUseCase(turmaRepository);

  return useCase;
}