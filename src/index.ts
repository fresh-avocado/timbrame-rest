import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import envService from './services/envService'
import configService from './services/configService'
import authRoutes, { authPath } from './routes/auth/auth.route'
import mongoose from 'mongoose'

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

const start = async () => {
  try {
    const [address,] = await Promise.all([
      server.listen({ port: envService.getNumber('PORT'), host: configService.getAddress() }),
      mongoose.connect(envService.getString('MONGO_CONN'))
    ])
    server.log.info(`Server listening at ${address} 👂`)
    server.log.info('Connected to MongoDB 🔌')
  } catch (error) {
    server.log.error(error)
  }
}

start()
