import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listarTurmas } from "./listarTurmas";
import { criarTurma } from "./criarTurma";
import { entrarTurma } from "./entrarTurma";
import { buscarTurma } from "./buscarTurma";
import { adicionarAluno } from "./adicionarAluno";
import { deletarTurma } from "./deletarTurma";

export async function turmaRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/turmas", listarTurmas);
  app.get("/turmas/:id", buscarTurma);
  app.post("/turmas", criarTurma);
  app.post("/turmas/:id/inscricao", entrarTurma);
  app.post("/turmas/:id/alunos", adicionarAluno);
  app.delete("/turmas/:id", deletarTurma);
}