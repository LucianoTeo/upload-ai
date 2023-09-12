import {  fastify } from 'fastify';

const app = fastify()

app.get('/', () => {
  return 'Helo World'
})

app.listen({
  port: 3333,
}).then(() => {
  return 'Server is running'
})