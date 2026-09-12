import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listarAulas } from "./listarAulas";
import { buscarAulaPorId } from "./buscarAulaPorId";
import { criarAula } from "./criarAula";

export async function aulaRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/aulas", listarAulas);
  app.get("/aulas/:id", buscarAulaPorId);
  app.post("/aulas", criarAula);
}