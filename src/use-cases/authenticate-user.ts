import { User } from "@prisma/client";
import { usersRepository } from "@/repositories/users-repository";
import { verifyPassword } from "@/lib/password";
import { invalidCredentialsError } from "./erros/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
  email: string;
  password_hash: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRespository: usersRepository) {}

  async execute({ email, password_hash }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRespository.findByEmail(email);

    if (!user) {
      throw new invalidCredentialsError();
    }

    const passwordMatches = await verifyPassword(password_hash, user.password_hash);

    if (!passwordMatches) {
      throw new invalidCredentialsError();
    }

    return { user };
  }
}