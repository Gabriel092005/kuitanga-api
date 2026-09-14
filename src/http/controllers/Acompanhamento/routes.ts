import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listaAcompanhamento } from "./listar";
import { listaAcompanhamentoProfessor } from "./listarProfessor";

export async function acompanhamentoRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/acompanhamento", listaAcompanhamento);
  app.get("/acompanhamento/professor", listaAcompanhamentoProfessor);
}