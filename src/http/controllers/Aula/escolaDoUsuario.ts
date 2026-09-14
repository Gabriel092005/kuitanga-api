import { prisma } from "@/lib/prisma";

export async function escolaDoUsuario(userId: string): Promise<string | null> {
  const matricula = await prisma.matricula.findFirst({
    where: { userId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return matricula?.escolaId ?? null;
}