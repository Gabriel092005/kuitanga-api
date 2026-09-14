import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listarAtividades } from "./listarAtividades";
import { buscarAtividade } from "./buscarAtividade";
import { criarAtividade } from "./criarAtividade";
import { responderAtividade } from "./responderAtividade";
import { deletarAtividade } from "./deletarAtividade";

export async function atividadeRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/atividades", listarAtividades);
  app.get("/atividades/:id", buscarAtividade);
  app.post("/atividades", criarAtividade);
  app.post("/atividades/:id/responder", responderAtividade);
  app.delete("/atividades/:id", deletarAtividade);
}