import {  fastify } from 'fastify';
import { getAllPromptsRoute } from './routes/get-all-prompts';
import { uploadAudioRoute } from './routes/upload-audio';

const app = fastify()

app.register(getAllPromptsRoute)
app.register(uploadAudioRoute)

app.listen({
  port: 3333,
}).then(() => {
  return 'Server is running'
})