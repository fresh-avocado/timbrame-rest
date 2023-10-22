import { FastifyInstance } from 'fastify'
import { SignInSchema, SignUpSchema } from './auth.schema'
import { ResponseSchema } from '../../utils/error.schema'
import { COOKIE_OPTIONS } from '../../utils/constants'
import { isAuthenticated } from '../../middleware/auth.middleware'

export const authPath = '/auth'

const routes = async (server: FastifyInstance): Promise<void> => {

  server.post('/signIn', { schema: { body: SignInSchema, response: { 200: ResponseSchema } } }, (req, res) => {
    res.code(200).setCookie('sessionId', 'my session id', COOKIE_OPTIONS).send({ msg: 'Sign In' })
  })

  server.post('/signUp', { schema: { body: SignUpSchema, response: { 201: ResponseSchema } } }, (req, res) => {
    res.code(200).send({ msg: 'Sign Up' })
  })

  server.post('/logout', { onRequest: [isAuthenticated(server)], schema: { response: { 200: ResponseSchema } } }, (req, res) => {
    res.code(200).clearCookie('sessionId', COOKIE_OPTIONS).send({ msg: 'Sesión cerrada' })
  })

}

export default routes
