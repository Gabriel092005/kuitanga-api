import { Aluno as AlunoEnum, Role, User } from "@prisma/client";
import { usersRepository } from "@/repositories/users-repository";
import { hashPassword } from "@/lib/password";
import { TipoDeCadastro, resolverPapeis } from "@/lib/roles";
import { UserAreadyExistsError } from "./erros/user-already-Exists";

interface RegisterUseCaseRequest {
  nome: string;
  email: string;
  password: string;
  number?: string;
  tipo: TipoDeCadastro;
  role?: Role;
  Aluno?: AlunoEnum;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: usersRepository) {}

  async execute({
    nome,
    email,
    password,
    number,
    tipo,
    role,
    Aluno,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAreadyExistsError();
    }

    const papeis = resolverPapeis(tipo);

    const user = await this.usersRepository.create({
      nome,
      email,
      password_hash: await hashPassword(password),
      number: number ?? "000000000",
      role: role ?? papeis.role,
      Aluno: Aluno ?? papeis.Aluno,
    });

    return { user };
  }

  async Execute(request: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    return this.execute(request);
  }
}