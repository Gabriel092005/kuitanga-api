import { Aluno, Role } from "@prisma/client";

export const tiposDeCadastro = ["ALUNO", "PROFESSOR", "ENCARREGADO"] as const;

export type TipoDeCadastro = (typeof tiposDeCadastro)[number];

interface Papeis {
  role: Role;
  Aluno: Aluno;
}

export function resolverPapeis(tipo: TipoDeCadastro): Papeis {
  switch (tipo) {
    case "PROFESSOR":
      return { role: Role.PROFESSOR, Aluno: Aluno.ALUNO };
    case "ENCARREGADO":
      return { role: Role.ENCARREGADO, Aluno: Aluno.RESPONSAVEL };
    case "ALUNO":
      return { role: Role.MEMBER, Aluno: Aluno.ALUNO };
  }
}

export function normalizarTipoDeCadastro(valor: string): TipoDeCadastro {
  const normalizado = valor.trim().toUpperCase();

  if (normalizado === "RESPONSAVEL" || normalizado === "ENCARREGADO") {
    return "ENCARREGADO";
  }

  if (normalizado === "ALUNO" || normalizado === "MEMBER" || normalizado === "ESTUDANTE") {
    return "ALUNO";
  }

  if (normalizado === "PROFESSOR" || normalizado === "PROF" || normalizado === "DOCENTE") {
    return "PROFESSOR";
  }

  throw new Error(`tipo de cadastro invalido: ${valor}`);
}