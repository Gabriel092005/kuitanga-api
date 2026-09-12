import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listarAulasAoVivo } from "./listarAulasAoVivo";
import { solicitarAulaAoVivo } from "./solicitarAulaAoVivo";

export async function aulaAoVivoRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/aulas-ao-vivo", listarAulasAoVivo);
  app.post("/aulas-ao-vivo", solicitarAulaAoVivo);
}