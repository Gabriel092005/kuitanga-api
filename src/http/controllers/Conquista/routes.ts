import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middleware/verify-jwt";
import { listarConquistas } from "./listarConquistas";

export async function conquistaRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/conquistas", listarConquistas);
}