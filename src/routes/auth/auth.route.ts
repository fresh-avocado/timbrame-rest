import { FastifyInstance, FastifyRequest } from 'fastify'
import { SignInSchema, SignInType, SignUpSchema, SignUpType } from './auth.schema'
import { ResponseSchema } from '../../utils/error.schema'
import { COOKIE_OPTIONS } from '../../utils/constants'
import { isAuthenticated } from '../../middleware/auth.middleware'
import { UserModel } from '../../models/models'
import passwordService from 'src/services/passwordService'

export const authPath = '/auth'

const routes = async (server: FastifyInstance): Promise<void> => {

  server.post('/signIn', { schema: { body: SignInSchema, response: { 200: ResponseSchema } } }, async (req: FastifyRequest<{ Body: SignInType }>, res) => {
    const user = await UserModel.findByUsername(req.body.username)

    if (user === null) {
      return res.code(404).send({ msg: 'Username o contraseña inválida.' })
    }

    const samePassword = await passwordService.isSamePassword(req.body.password, user.password)

    if (samePassword) {
      // TODO: crear sesión en Dynamo
      return res.code(200).setCookie('sessionId', JSON.stringify({ username: req.body.username }), COOKIE_OPTIONS).send({ msg: '¡Sesión iniciada!' })
    } else {
      return res.code(404).send({ msg: 'Username o contraseña inválida.' })
    }
  })

  server.post('/signUp', { schema: { body: SignUpSchema, response: { 201: ResponseSchema } } }, async (req: FastifyRequest<{ Body: SignUpType }>, res) => {
    const [duplicateEmail, duplicateUsername] = await Promise.all([
      UserModel.isDuplicateEmail(req.body.email),
      UserModel.isDuplicateUsername(req.body.username),
    ])

    if (duplicateEmail) {
      return res.code(409).send({ msg: 'Email repetido. Usa otro, por favor.' })
    }

    if (duplicateUsername) {
      return res.code(409).send({ msg: 'Username repetido. Usa otro, por favor.' })
    }

    // FIXME: quizás más eficiente insertar y que el unique index bote el error, para no tener que hacer 3 queries distintos

    await UserModel.insert({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await passwordService.hashPassword(req.body.password), // TODO: hash password!
      username: req.body.username,
    })

    // TODO: crear sesión en Dynamo
    return res.code(200).setCookie('sessionId', JSON.stringify({ username: req.body.username }), COOKIE_OPTIONS).send({ msg: '¡Cuenta creada!' })
  })

  server.post('/logOut', { onRequest: [isAuthenticated(server)], schema: { response: { 200: ResponseSchema } } }, (req, res) => {
    res.code(200).clearCookie('sessionId', COOKIE_OPTIONS).send({ msg: 'Sesión cerrada' })
  })

}

export default routes
