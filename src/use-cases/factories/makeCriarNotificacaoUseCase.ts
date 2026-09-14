import { PrismaNoticacaoRepository } from "@/repositories/prisma/Prisma-Noticacao-repository";
import { CriarNotificacaoUseCase } from "../criar-notificacao";

export function makeCriarNotificacaoUseCase() {
  const notificacaoRepository = new PrismaNoticacaoRepository();
  const useCase = new CriarNotificacaoUseCase(notificacaoRepository);

  return useCase;
}