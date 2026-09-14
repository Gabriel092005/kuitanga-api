import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

const extensoesPermitidas = [".mp4", ".webm", ".mov", ".ogg", ".mkv", ".m4v"];

export async function enviarVideo(request: FastifyRequest, reply: FastifyReply) {
  const data = await request.file();

  if (!data) {
    return reply.status(400).send({ message: "nenhum arquivo enviado" });
  }

  const extensao = extname(data.filename).toLowerCase();

  if (!extensoesPermitidas.includes(extensao)) {
    data.file.resume();
    return reply.status(400).send({ message: "formato de video nao suportado" });
  }

  const pastaUploads = join(process.cwd(), "uploads");
  await mkdir(pastaUploads, { recursive: true });

  const nomeArquivo = `${randomUUID()}${extensao}`;
  const caminhoArquivo = join(pastaUploads, nomeArquivo);

  await pump(data.file, createWriteStream(caminhoArquivo));

  return reply.status(201).send({
    message: "video enviado com sucesso",
    videoUrl: `/uploads/${nomeArquivo}`,
  });
}