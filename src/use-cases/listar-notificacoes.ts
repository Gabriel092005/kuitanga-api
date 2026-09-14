import { notificacao } from "@prisma/client";
import { notificationRepository } from "@/repositories/notificacao-repository";

interface listarNotificacoesResponse {
  notificacoes: notificacao[];
}

export class ListarNotificacoesUseCase {
  constructor(private notificacaoRepository: notificationRepository) {}

  async execute(userId: string): Promise<listarNotificacoesResponse> {
    const notificacoes = await this.notificacaoRepository.listByUserId(userId);

    return { notificacoes };
  }
}