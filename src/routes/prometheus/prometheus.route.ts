import { FastifyInstance } from 'fastify'
import { getMetrics } from 'src/controllers/prom.controller'

export const prometheusPath = '/metrics'

const routes = async (server: FastifyInstance): Promise<void> => {
  server.get('/', getMetrics)
}

export default routes
