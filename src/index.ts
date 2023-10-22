import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import envService from './services/envService'
import configService from './services/configService'
import authRoutes, { authPath } from './routes/auth/auth.route'
import { Server } from 'tls'

const server = fastify({
  logger: configService.getLoggerConfig(),
})

server.register(fastifyCookie, {
  secret: envService.getString('COOKIE_SECRET'),
  parseOptions: {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: 'lax',
  },
})
server.register(authRoutes, { prefix: authPath })

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.listen({ port: envService.getNumber('PORT'), host: configService.getAddress() }, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}
