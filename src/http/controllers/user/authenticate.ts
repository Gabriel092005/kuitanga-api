
import { makeAuthenticateUseCase } from "@/use-cases/factories/makeAuthenticateUseCase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";


export async function  authenticate(request:FastifyRequest,reply:FastifyReply){
    const authenticateBodySchema  = z.object({
        email : z.string().min(3).max(255).regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
        password: z.string(),
    })
    const {email,password} = authenticateBodySchema.parse(request.body)
    try {
        const authenticateUseCase = makeAuthenticateUseCase()
        const {user} = await authenticateUseCase.execute({
            email,
            password_hash: password
        })
        const token = await reply.jwtSign({
            role : user.role
        },
        {
             sub : user.id

        })
        const refreshToken = await reply.jwtSign(
            {
               role : user.role 
            },
            {
               sign:{
                  sub:user.id,
                  expiresIn:'7d',
               }
            }
         )
         return reply
         .setCookie('refreshToken',refreshToken,{
            path : '/',
            secure:true,
            httpOnly:true
        })
         .status(200)
         .send({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                Aluno: user.Aluno,
            },
        })
   
        } catch (error)
         {
            if (error instanceof Error) {
                return reply.status(401).send({ message: error.message })
            }
            return reply.status(401).send({ message: "Credenciais inválidas" })
         }

    
}
