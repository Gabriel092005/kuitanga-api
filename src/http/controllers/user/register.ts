import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeRegisterUserCase } from "@/use-cases/factories/makeRegisterUserUseCase";
import { UserAreadyExistsError } from "@/use-cases/erros/user-already-Exists";
import { TipoDeCadastro, normalizarTipoDeCadastro, tiposDeCadastro } from "@/lib/roles";

const emailSchema = z.string().min(3).max(255).regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);

const tipoSchema = z
  .preprocess(
    (valor) => {
      if (typeof valor === "string") {
        const normalizado = valor.trim().toUpperCase();
        return normalizado === "" ? undefined : normalizado;
      }

      return valor ?? undefined;
    },
    z.enum([...tiposDeCadastro, "MEMBER", "ESTUDANTE", "RESPONSAVEL", "PROF", "DOCENTE"]).optional(),
  )
  .transform((valor): TipoDeCadastro | undefined =>
    valor === undefined ? undefined : normalizarTipoDeCadastro(valor),
  );

const RegisterBodySchema = z
  .object({
    nome: z.string().trim().min(2),
    email: emailSchema,
    number: z.string().trim().optional(),
    password: z.string().min(6).optional(),
    password_hash: z.string().min(6).optional(),
    tipo: tipoSchema,
    role: tipoSchema,
    papel: tipoSchema,
  })
  .refine((body) => Boolean(body.password ?? body.password_hash), {
    message: "password e obrigatorio",
    path: ["password"],
  });

export async function Register(request: FastifyRequest, reply: FastifyReply) {
  const { nome, email, number, password, password_hash, tipo, role, papel } =
    RegisterBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUserCase();

    const { user } = await registerUseCase.execute({
      nome,
      email,
      password: password ?? password_hash!,
      number,
      tipo: tipo ?? role ?? papel ?? "ALUNO",
    });

    return reply.status(201).send({
      message: "utilizador criado com sucesso",
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        number: user.number,
        role: user.role,
        Aluno: user.Aluno,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof UserAreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}