import { PrismaClient, Role, Aluno, School } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const usuariosDemo = [
    {
      nome: "Admin Kuitanga",
      email: "admin@kuitanga.com",
      password_hash: "admin123",
      number: "+244 900 000 001",
      role: Role.ADMIN,
      Aluno: Aluno.ALUNO,
    },
    {
      nome: "Professor Ana",
      email: "professor@kuitanga.com",
      password_hash: "prof123",
      number: "+244 900 000 002",
      role: Role.MEMBER,
      Aluno: Aluno.ALUNO,
    },
    {
      nome: "Aluno Pedro",
      email: "aluno@kuitanga.com",
      password_hash: "aluno123",
      number: "+244 900 000 003",
      role: Role.MEMBER,
      Aluno: Aluno.ALUNO,
    },
    {
      nome: "Encarregado Maria",
      email: "encarregado@kuitanga.com",
      password_hash: "encar123",
      number: "+244 900 000 004",
      role: Role.MEMBER,
      Aluno: Aluno.RESPONSAVEL,
    },
  ];

  for (const user of usuariosDemo) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  const escolasDemo = [
    {
      name: "Escola Primária Kuitanga",
      adress: "Luanda, Angola",
      email: "primaria@kuitanga.com",
      type: School.PUBLICO,
      Description: "Ensino primário público com foco em metodologias interativas.",
    },
    {
      name: "Colégio Privado Horizonte",
      adress: "Benguela, Angola",
      email: "colehio@kuitanga.com",
      type: School.PRIVADO,
      Description: "Colégio privado com turmas do ensino primário ao secundário.",
    },
    {
      name: "Escola Secundária Nova Era",
      adress: "Huambo, Angola",
      email: "secundaria@kuitanga.com",
      type: School.PUBLICO,
      Description: "Ensino secundário público com laboratórios de informática.",
    },
  ];

  for (const escola of escolasDemo) {
    await prisma.escola.upsert({
      where: { email: escola.email },
      update: {},
      create: escola,
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
