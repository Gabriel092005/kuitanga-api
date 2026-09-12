import { aulaAoVivo, Prisma } from "@prisma/client";

export interface aulaAoVivoRepository {
  criar(data: Prisma.aulaAoVivoUncheckedCreateInput): Promise<aulaAoVivo>;
  listar(): Promise<aulaAoVivo[]>;
}