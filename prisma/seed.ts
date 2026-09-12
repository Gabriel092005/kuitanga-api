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

  const professor = await prisma.user.findUnique({
    where: { email: "professor@kuitanga.com" },
  });

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
      if (!existe) {
        await prisma.aulaAoVivo.create({
          data: {
            ...aula,
            userId: professor.id,
          },
        });
      }
    }
  }

  const aulasGravadasDemo = [
    {
      titulo: "Introducao a Algebra - Variaveis e Expressoes",
      professor: "Prof. Ana Martins",
      materia: "Matematica",
      duracao: "32:15",
      visualizacoes: 1243,
      data: "22 Jul 2026",
      thumbnail: "azul",
      descricao:
        "Aprenda os conceitos basicos de algebra, variaveis e como resolver expressoes simples. Nesta aula vamos cobrir operacoes fundamentais e aplicacoes no dia a dia.",
      topicos: ["O que sao variaveis", "Expressoes algebraicas", "Resolucao de equacoes simples", "Exercicios praticos"],
    },
    {
      titulo: "Figuras de Linguagem - Metafora e Comparacao",
      professor: "Prof. Carlos Neto",
      materia: "Portugues",
      duracao: "28:40",
      visualizacoes: 876,
      data: "20 Jul 2026",
      thumbnail: "roxo",
      descricao:
        "Entenda as principais figuras de linguagem e como identifical-as em textos literarios e do cotidiano.",
      topicos: ["Metafora", "Comparacao", "Hipérbole", "Analise de textos"],
    },
    {
      titulo: "O Sistema Solar e seus Planetas",
      professor: "Prof. Maria Jose",
      materia: "Ciencias",
      duracao: "45:10",
      visualizacoes: 2105,
      data: "18 Jul 2026",
      thumbnail: "verde",
      descricao:
        "Uma viagem pelo sistema solar, conhecendo as caracteristicas de cada planeta e seus dados curiosos.",
      topicos: ["Planetas rochosos", "Gases gigantes", "Cintura de asteroides", "Dados curiosos"],
    },
    {
      titulo: "Geometria Plana - Areas e Perimetros",
      professor: "Prof. Ana Martins",
      materia: "Matematica",
      duracao: "38:22",
      visualizacoes: 1567,
      data: "17 Jul 2026",
      thumbnail: "amarelo",
      descricao:
        "Calcule areas e perimetros de figuras planas com exercicios praticos e resolucao passo a passo.",
      topicos: ["Area do quadrado e retangulo", "Area do circulo", "Perimetros", "Problemas praticos"],
    },
    {
      titulo: "Revolucao Industrial - Impactos na Sociedade",
      professor: "Prof. Pedro Silva",
      materia: "Historia",
      duracao: "41:55",
      visualizacoes: 934,
      data: "15 Jul 2026",
      thumbnail: "laranja",
      descricao:
        "Como a revolucao industrial transformou a economia e a sociedade mundial para sempre.",
      topicos: ["A maquina a vapor", "Mudancas sociais", "Urbanizacao", "Legado historico"],
    },
    {
      titulo: "Continentes e Oceanos do Mundo",
      professor: "Prof. Lucia Santos",
      materia: "Geografia",
      duracao: "35:30",
      visualizacoes: 1089,
      data: "14 Jul 2026",
      thumbnail: "ciano",
      descricao:
        "Conheca os continentes, oceanos e as principais caracteristicas geograficas do nosso planeta.",
      topicos: ["Os 7 continentes", "Oceanos e mares", "Relevo terrestre", "Clima e vegetacao"],
    },
    {
      titulo: "Raciocinio Logico - Padroes e Sequencias",
      professor: "Prof. Ana Martins",
      materia: "Raciocinio",
      duracao: "26:48",
      visualizacoes: 756,
      data: "12 Jul 2026",
      thumbnail: "rosa",
      descricao:
        "Desenvolva seu raciocinio logico com padroes, sequencias e combinatoria.",
      topicos: ["Sequencias numericas", "Padroes visuais", "Logica dedutiva", "Desafios"],
    },
    {
      titulo: "Especies Animais de Angola",
      professor: "Prof. Maria Jose",
      materia: "Ciencias",
      duracao: "39:12",
      visualizacoes: 1823,
      data: "10 Jul 2026",
      thumbnail: "verde",
      descricao:
        "Descubra as especies animais nativas de Angola e seus habitats naturais.",
      topicos: ["Fauna endemica", "Habitats e ecossistemas", "Animais em risco", "Conservacao"],
    },
  ];

  for (const aula of aulasGravadasDemo) {
    const existe = await prisma.aula.findFirst({
      where: { titulo: aula.titulo },
    });
    if (!existe) {
      await prisma.aula.create({ data: aula });
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
