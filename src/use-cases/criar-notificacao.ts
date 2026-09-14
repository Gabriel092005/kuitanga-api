import { notificationRepository } from "@/repositories/notificacao-repository";

interface criarNotificacaoRequest {
  userId: string;
  content: string;
}

export class CriarNotificacaoUseCase {
  constructor(private notificacaoRepository: notificationRepository) {}

  async execute({ userId, content }: criarNotificacaoRequest) {
    return this.notificacaoRepository.create({ userId, content });
  }
}