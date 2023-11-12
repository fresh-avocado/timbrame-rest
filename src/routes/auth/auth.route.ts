import { FastifyInstance, FastifyRequest } from 'fastify'
import { SignInSchema, SignInType, SignUpSchema, SignUpType } from './auth.schema'
import { ResponseSchema } from '../../utils/error.schema'
import { COOKIE_OPTIONS } from '../../utils/constants'
import { isAuthenticated } from '../../middleware/auth.middleware'
import { UserModel } from '../../models/models'
import passwordService from 'src/services/passwordService'
import redisService from 'src/services/redisService'
import logService from 'src/services/logService'

export const authPath = '/auth'

const routes = async (server: FastifyInstance): Promise<void> => {

  server.post('/signIn', { schema: { body: SignInSchema, response: { 200: ResponseSchema } } }, async (req: FastifyRequest<{ Body: SignInType }>, res) => {
    const user = await UserModel.findByUsername(req.body.username)

    if (user === null) {
      return res.code(404).send({ msg: 'Username o contraseña inválida.' })
    }

    const samePassword = await passwordService.isSamePassword(req.body.password, user.password)

    if (samePassword) {
      const sessionId = await redisService.createSession(user)
      logService.sendLog({ breach: false, msg: 'user signIn successfull' })
      return res.code(200).setCookie('sessionId', sessionId, COOKIE_OPTIONS).send({ msg: '¡Sesión iniciada!' })
    } else {
      logService.sendLog({ breach: true, msg: `wrong username or password from ip: ${req.ip}` })
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

    const newUser = await UserModel.insert({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await passwordService.hashPassword(req.body.password), // TODO: hash password!
      username: req.body.username,
    })

    const sessionId = await redisService.createSession({ _id: newUser._id, username: newUser.username })
    return res.code(200).setCookie('sessionId', sessionId, COOKIE_OPTIONS).send({ msg: '¡Cuenta creada!' })
  })

  server.post('/logOut', { onRequest: [isAuthenticated(server)], schema: { response: { 200: ResponseSchema } } }, (req, res) => {
    console.log(`session: ${JSON.stringify(req.session, null, 2)}`)
    return res.code(200).clearCookie('sessionId', COOKIE_OPTIONS).send({ msg: 'Sesión cerrada' })
  })

}

export default routes
