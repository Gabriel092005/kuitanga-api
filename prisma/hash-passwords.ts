import { PrismaClient } from "@prisma/client";
import { hashPassword, isHashed } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, password_hash: true } });

  const emTextoPuro = users.filter((user) => !isHashed(user.password_hash));

  if (emTextoPuro.length === 0) {
    console.log("nenhuma senha em texto puro encontrada");
    return;
  }

  for (const user of emTextoPuro) {
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: await hashPassword(user.password_hash) },
    });

    console.log(`senha de ${user.email} convertida para hash`);
  }

  console.log(`${emTextoPuro.length} senha(s) convertida(s) para hash`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });