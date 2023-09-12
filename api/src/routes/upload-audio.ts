import { FastifyInstance } from "fastify";
import { fastifyMultipart } from '@fastify/multipart';

import path from "node:path";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline) // get pipeline as promise

import { prisma } from '../lib/prisma'

export async function uploadAudioRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25 // 25 mb
    }
  })

  app.post('/audios', async (request, reply) => {
    const data = await request.file()

    if(!data) {
      return reply.status(400).send({ error: 'Missing file input.' })
    }

    const fileExtension = path.extname(data.filename);

    if(fileExtension !== '.mp3') {
      return reply.status(400).send({ error: 'Invalid input file extension, provide a MP3 file.' })
    }

    const fileBaseName = path.basename(data.filename, fileExtension)

    const fileUploadName = `${fileBaseName}-${randomUUID()}${fileExtension}`
    const fileUploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(fileUploadDestination))

    const audio = await prisma.audio.create({
      data: {
        name: data.filename,
        path: fileUploadDestination,
      }
    })

    return reply.send({
      audio
    })
  })
}