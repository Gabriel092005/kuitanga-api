import { aula, Prisma } from "@prisma/client";

export interface aulaRepository {
  listar(): Promise<aula[]>;
  buscarPorId(id: number): Promise<aula | null>;
  criar(data: Prisma.aulaUncheckedCreateInput): Promise<aula>;
}