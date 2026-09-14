import { aulaAoVivo, Prisma } from "@prisma/client";

export interface listarAulasAoVivoParams {
  professorId?: string;
  turmaId?: string;
  userId?: string;
}

export interface aulaAoVivoRepository {
  criar(data: Prisma.aulaAoVivoUncheckedCreateInput): Promise<aulaAoVivo>;
  listar(params?: listarAulasAoVivoParams): Promise<aulaAoVivo[]>;
}