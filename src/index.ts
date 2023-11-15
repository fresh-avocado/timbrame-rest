import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'

import envService from './services/envService'
import configService from './services/configService'
import authRoutes, { authPath } from './routes/auth/auth.route'
import prometheusRoutes, { prometheusPath } from './routes/prometheus/prometheus.route'
import mongoose from 'mongoose'
import fastifyCors from '@fastify/cors'
import redisService, { TimbrameSession } from './services/redisService'

declare module 'fastify' {
  interface FastifyRequest {
    session: TimbrameSession
    userAgent: string
  }
}

const server = fastify({
  logger: configService.getLoggerConfig(),
})

server.register(fastifyCors, {
  credentials: true,
  origin: envService.isProd() ? 'TODO PROD FRONT URL' : 'http://127.0.0.1:3000',
})
server.register(fastifyCookie, {
  secret: envService.getString('COOKIE_SECRET'),
  parseOptions: {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: 'lax',
  },
  algorithm: 'sha512',
})
server.register(authRoutes, { prefix: authPath })
server.register(prometheusRoutes, { prefix: prometheusPath })

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.addHook('preHandler', (req, res, done) => {
  req.userAgent = req.headers['user-agent'] ?? 'none detected'
  done()
})

const start = async () => {
  try {
    const [address,] = await Promise.all([
      server.listen({ port: envService.getNumber('PORT'), host: configService.getAddress() }),
      mongoose.connect(envService.getString('MONGO_CONN')),
      redisService.connect(),
    ])
    server.log.info(`Server listening at ${address} 👂`)
    server.log.info('Connected to MongoDB 🔌')
    server.log.info('Connected to Redis 🔴')
  } catch (error) {
    server.log.error(error)
  }
}

start()

export const logger = server.log
