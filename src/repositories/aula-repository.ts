import { aula, Prisma } from "@prisma/client";

export interface listarAulasParams {
  professorId?: string;
  turmaId?: string;
}

export interface aulaRepository {
  listar(params?: listarAulasParams): Promise<aula[]>;
  buscarPorId(id: number): Promise<aula | null>;
  criar(data: Prisma.aulaUncheckedCreateInput): Promise<aula>;
  deletar(id: number): Promise<void>;
}