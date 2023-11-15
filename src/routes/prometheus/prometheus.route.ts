import { FastifyInstance } from 'fastify'
import { getMetrics } from 'src/controllers/prom.controller'

export const prometheusPath = '/metrics'

// TODO: add auth to this endpoint
const routes = async (server: FastifyInstance): Promise<void> => {
  server.get('/', getMetrics)
}

export default routes
