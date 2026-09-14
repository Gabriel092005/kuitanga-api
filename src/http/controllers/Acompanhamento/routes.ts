import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listaAcompanhamento } from "./listar";

export async function acompanhamentoRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/acompanhamento", listaAcompanhamento);
}