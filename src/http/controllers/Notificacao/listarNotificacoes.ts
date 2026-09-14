import { FastifyRequest, FastifyReply } from "fastify";
import { makeListarNotificacoesUseCase } from "@/use-cases/factories/makeListarNotificacoesUseCase";

export async function listarNotificacoes(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user as { sub: string };

  const listarNotificacoesUseCase = makeListarNotificacoesUseCase();

  const { notificacoes } = await listarNotificacoesUseCase.execute(userId);

  return reply.status(200).send({ notificacoes });
}