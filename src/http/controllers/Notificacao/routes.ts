import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listarNotificacoes } from "./listarNotificacoes";

export async function notificacaoRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/notificacoes", listarNotificacoes);
}