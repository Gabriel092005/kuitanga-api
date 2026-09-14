import { PrismaTurmaRepository } from "@/repositories/prisma/Prisma-turma-repository";
import { ListarTurmasUseCase } from "../listar-turmas";

export function makeListarTurmasUseCase() {
  const turmaRepository = new PrismaTurmaRepository();
  const useCase = new ListarTurmasUseCase(turmaRepository);

  return useCase;
}