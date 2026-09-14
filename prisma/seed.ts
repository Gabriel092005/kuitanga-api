import { PrismaClient, Role, Aluno, School, StatusMatricula } from "@prisma/client";

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
      role: Role.PROFESSOR,
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

  const matriculasDemo = [
    { email: "admin@kuitanga.com", escolaEmail: "primaria@kuitanga.com" },
    { email: "professor@kuitanga.com", escolaEmail: "primaria@kuitanga.com" },
    { email: "aluno@kuitanga.com", escolaEmail: "primaria@kuitanga.com" },
  ];

  for (const { email, escolaEmail } of matriculasDemo) {
    const user = await prisma.user.findUnique({ where: { email } });
    const escola = await prisma.escola.findUnique({ where: { email: escolaEmail } });
    if (user && escola) {
      const existe = await prisma.matricula.findFirst({
        where: { userId: user.id, escolaId: escola.id },
      });
      if (!existe) {
        await prisma.matricula.create({
          data: { userId: user.id, escolaId: escola.id, status: StatusMatricula.CONFIRMADO },
        });
      }
    }
  }

  const professorAna = await prisma.user.findUnique({
    where: { email: "professor@kuitanga.com" },
  });

  const primaria = await prisma.escola.findUnique({
    where: { email: "primaria@kuitanga.com" },
  });

  const turmasDemo = [
    { nome: "Jardim A", materia: "Matematica" },
    { nome: "Jardim B", materia: "Portugues" },
    { nome: "2a Classe A", materia: "Historia" },
  ];

  if (professorAna && primaria) {
    for (const t of turmasDemo) {
      const existe = await prisma.turma.findFirst({
        where: { nome: t.nome, professorId: professorAna.id },
      });
      if (!existe) {
        await prisma.turma.create({
          data: { ...t, professorId: professorAna.id, escolaId: primaria.id },
        });
      }
    }
  }

  const professor = await prisma.user.findUnique({
    where: { email: "professor@kuitanga.com" },
  });

  await prisma.user.update({
    where: { email: "professor@kuitanga.com" },
    data: { role: Role.PROFESSOR },
  });

  const alunoPedro = await prisma.user.findUnique({
    where: { email: "aluno@kuitanga.com" },
  });

  const escolaPrimaria = await prisma.escola.findUnique({
    where: { email: "primaria@kuitanga.com" },
  });

  let turmaPrimariaId: string | null = null;
  if (professor && escolaPrimaria) {
    const turma = await prisma.turma.findFirst({
      where: { nome: "6ª A", escolaId: escolaPrimaria.id },
    });
    if (turma) {
      turmaPrimariaId = turma.id;
    } else {
      const nova = await prisma.turma.create({
        data: {
          nome: "6ª A",
          materia: "Matematica",
          status: "ativo",
          professorId: professor.id,
          escolaId: escolaPrimaria.id,
        },
      });
      turmaPrimariaId = nova.id;
    }
  }

  if (alunoPedro && turmaPrimariaId) {
    await prisma.user.update({
      where: { id: alunoPedro.id },
      data: { turmaId: turmaPrimariaId },
    });
  }

  const aulasDemo = [
    {
      tema: "Matematica - Exercicios de Fracoes",
      materia: "Matematica",
      professor: "Prof. Ana Martins",
      data: new Date(),
      hora: "14:00",
    },
    {
      tema: "Portugues - Verbos Regulares",
      materia: "Portugues",
      professor: "Prof. Ana Martins",
      data: new Date(Date.now() + 86400000),
      hora: "10:00",
    },
  ];

  if (professor) {
    for (const aula of aulasDemo) {
      const existe = await prisma.aulaAoVivo.findFirst({
        where: { tema: aula.tema },
      });
      if (existe) {
        await prisma.aulaAoVivo.update({
          where: { id: existe.id },
          data: {
            data: aula.data,
            userId: professor.id,
            turmaId: turmaPrimariaId ?? undefined,
          },
        });
      } else {
        await prisma.aulaAoVivo.create({
          data: {
            ...aula,
            userId: professor.id,
            turmaId: turmaPrimariaId ?? undefined,
          },
        });
      }
    }
  }

  const atividadesDemo = [
    {
      titulo: "Adicao com Figuras",
      materia: "Matematica",
      pontos: 20,
      dificuldade: "Facil",
      tempoEstimado: "10 min",
      descricao: "Pratique operacoes de adicao usando figuras geometricas como referencia.",
      cor: "azul",
      icone: "calculator",
      perguntas: [
        { pergunta: "Quanto e 3 + 4?", expressao: "3 + 4 = ?", opcoes: ["5", "6", "7", "8"], resposta: 2 },
        { pergunta: "Quanto e 8 + 5?", expressao: "8 + 5 = ?", opcoes: ["11", "12", "13", "14"], resposta: 2 },
        { pergunta: "Quanto e 6 + 9?", expressao: "6 + 9 = ?", opcoes: ["13", "14", "15", "16"], resposta: 2 },
        { pergunta: "Quanto e 12 + 7?", expressao: "12 + 7 = ?", opcoes: ["17", "18", "19", "20"], resposta: 2 },
        { pergunta: "Quanto e 15 + 6?", expressao: "15 + 6 = ?", opcoes: ["19", "20", "21", "22"], resposta: 2 },
      ],
    },
    {
      titulo: "Complete as Palavras",
      materia: "Portugues",
      pontos: 15,
      dificuldade: "Medio",
      tempoEstimado: "8 min",
      descricao: "Complete as palavras com as letras corretas e aprenda novos vocabulos.",
      cor: "roxo",
      icone: "pencil",
      perguntas: [
        { pergunta: "Complete: C_SA", expressao: "CASA", opcoes: ["A", "E", "I", "O"], resposta: 0 },
        { pergunta: "Complete: S_LA", expressao: "SALA", opcoes: ["O", "E", "A", "I"], resposta: 0 },
        { pergunta: "Complete: M_SA", expressao: "MESA", opcoes: ["A", "O", "E", "I"], resposta: 2 },
        { pergunta: "Complete: L_VRO", expressao: "LIVRO", opcoes: ["A", "I", "E", "O"], resposta: 1 },
        { pergunta: "Complete: CADEI_A", expressao: "CADEIRA", opcoes: ["R", "L", "S", "T"], resposta: 0 },
      ],
    },
    {
      titulo: "Os Cinco Sentidos",
      materia: "Ciencias",
      pontos: 20,
      dificuldade: "Facil",
      tempoEstimado: "10 min",
      descricao: "Descubra como funcionam os cinco sentidos do corpo humano.",
      cor: "verde",
      icone: "flask",
      perguntas: [
        { pergunta: "Qual orgao usamos para ver?", expressao: "Sentido da visao", opcoes: ["Ouvido", "Olho", "Nariz", "Boca"], resposta: 1 },
        { pergunta: "Qual orgao usamos para ouvir?", expressao: "Sentido da audicao", opcoes: ["Olho", "Nariz", "Ouvido", "Mao"], resposta: 2 },
        { pergunta: "Qual sentido detecta sabores?", expressao: "Sentido do paladar", opcoes: ["Tato", "Olfato", "Visao", "Paladar"], resposta: 3 },
        { pergunta: "Com qual sentido sentimos o frio?", expressao: "Sentido do tato", opcoes: ["Tato", "Paladar", "Olfato", "Visao"], resposta: 0 },
        { pergunta: "Qual orgao detecta cheiros?", expressao: "Sentido do olfato", opcoes: ["Lingua", "Nariz", "Orelha", "Pele"], resposta: 1 },
      ],
    },
    {
      titulo: "Sequencia Logica",
      materia: "Raciocinio",
      pontos: 25,
      dificuldade: "Dificil",
      tempoEstimado: "12 min",
      descricao: "Resolva sequencias numericas e padroes logicos para treinar o raciocinio.",
      cor: "rosa",
      icone: "shapes",
      perguntas: [
        { pergunta: "Qual e o proximo numero?", expressao: "2, 4, 6, 8, ?", opcoes: ["9", "10", "11", "12"], resposta: 1 },
        { pergunta: "Qual e o proximo numero?", expressao: "3, 6, 9, 12, ?", opcoes: ["13", "14", "15", "16"], resposta: 2 },
        { pergunta: "Qual e o proximo numero?", expressao: "5, 10, 20, 40, ?", opcoes: ["50", "60", "70", "80"], resposta: 3 },
        { pergunta: "Complete a sequencia", expressao: "A, C, E, G, ?", opcoes: ["H", "I", "J", "K"], resposta: 1 },
        { pergunta: "Qual e o proximo numero?", expressao: "1, 1, 2, 3, 5, ?", opcoes: ["6", "7", "8", "9"], resposta: 1 },
      ],
    },
    {
      titulo: "Subtracao Basica",
      materia: "Matematica",
      pontos: 20,
      dificuldade: "Facil",
      tempoEstimado: "10 min",
      descricao: "Pratique subtracao com exercicios do nivel basico ao intermediario.",
      cor: "amarelo",
      icone: "calculator",
      perguntas: [
        { pergunta: "Quanto e 10 - 3?", expressao: "10 - 3 = ?", opcoes: ["5", "6", "7", "8"], resposta: 2 },
        { pergunta: "Quanto e 15 - 8?", expressao: "15 - 8 = ?", opcoes: ["5", "6", "7", "8"], resposta: 2 },
        { pergunta: "Quanto e 20 - 12?", expressao: "20 - 12 = ?", opcoes: ["6", "7", "8", "9"], resposta: 2 },
        { pergunta: "Quanto e 25 - 9?", expressao: "25 - 9 = ?", opcoes: ["14", "15", "16", "17"], resposta: 2 },
        { pergunta: "Quanto e 30 - 18?", expressao: "30 - 18 = ?", opcoes: ["10", "11", "12", "13"], resposta: 2 },
      ],
    },
  ];

  if (professorAna && primaria) {
    for (const atividade of atividadesDemo) {
      const existe = await prisma.atividade.findFirst({
        where: { titulo: atividade.titulo },
      });
      if (!existe) {
        await prisma.atividade.create({
          data: {
            ...atividade,
            professor: professorAna.nome,
            userId: professorAna.id,
            escolaId: primaria.id,
          },
        });
      }
    }
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
