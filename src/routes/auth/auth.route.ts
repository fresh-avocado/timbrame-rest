import { FastifyInstance } from 'fastify'
import { SignInSchema, SignUpSchema } from './auth.schema'
import { ResponseSchema } from '../../utils/error.schema'
import { isAuthenticated } from '../../middleware/auth.middleware'
import { logOut, signIn, signUp } from 'src/controllers/auth.controller'

export const authPath = '/auth'

const routes = async (server: FastifyInstance): Promise<void> => {
  server.post('/signIn', { schema: { body: SignInSchema, response: { 200: ResponseSchema } } }, signIn)
  server.post('/signUp', { schema: { body: SignUpSchema, response: { 201: ResponseSchema } } }, signUp)
  server.post('/logOut', { onRequest: [isAuthenticated(server)], schema: { response: { 200: ResponseSchema } } }, logOut)
}

export default routes
