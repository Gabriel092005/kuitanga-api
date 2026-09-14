import { PrismaNoticacaoRepository } from "@/repositories/prisma/Prisma-Noticacao-repository";
import { ListarNotificacoesUseCase } from "../listar-notificacoes";

export function makeListarNotificacoesUseCase() {
  const notificacaoRepository = new PrismaNoticacaoRepository();
  const useCase = new ListarNotificacoesUseCase(notificacaoRepository);

  return useCase;
}