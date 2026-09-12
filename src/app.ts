import { fastify } from "fastify";
import { ZodError } from "zod";
import { env } from "./Env";
import { error } from "console";
import { userRoutes, } from "./http/controllers/user/routes";
import { schoolRoutes } from "./http/controllers/Escola/routes";
import { matriculaRoutes } from "./http/controllers/matricula/routes";
import { fastifyJwt } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { feedbackRoutes } from "./http/controllers/feedback/routes";
import { aulaAoVivoRoutes } from "./http/controllers/AulaAoVivo/routes";
import { aulaRoutes } from "./http/controllers/Aula/routes";





export const app = fastify()

app.register(fastifyCors, {
  origin: true,
  credentials: true,
})

app.register(userRoutes)
app.register(schoolRoutes)
app.register(matriculaRoutes)
app.register(feedbackRoutes)
app.register(aulaAoVivoRoutes)
app.register(aulaRoutes)
app.register(fastifyCookie)

app.register(fastifyJwt,{
    secret:env.JWT_SECRET,
    cookie:{
        cookieName:'refreshToken',
        signed:false,
    },
    sign:{
        expiresIn:'1d'
    }
},
   
)


app.setErrorHandler((Error,request,reply)=>{
    console.log(Error)

    if(Error instanceof ZodError){

        return reply.status(400)
        .send( {
            message : 'validation error' , 
            issues:Error.format()
        })
    }
    
    if(env.NODE_ENV!=='production'){
        console.error(error)
        
    }



    return reply
  
    .status(500)
    .send(
        {message : 'internal server error'}
    ) 
})