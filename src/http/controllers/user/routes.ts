import { FastifyInstance } from "fastify";
import { Delete } from "./delete";
import { authenticate } from "./authenticate";
import { Register } from "./register";
import { me } from "./me";
import { verifyJWT } from "../middleware/verify-jwt";





export async function userRoutes(app:FastifyInstance){

    app.post('/register',Register)
    app.delete('/delete',Delete)
    app.post('/sessions',authenticate)
    app.post('/login',authenticate)
    app.get('/me',{ onRequest: [verifyJWT] },me)

}