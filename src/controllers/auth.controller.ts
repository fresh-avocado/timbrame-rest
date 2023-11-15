import { FastifyReply, FastifyRequest } from "fastify"
import { UserModel } from "src/models/models"
import { SignInType, SignUpType } from "src/routes/auth/auth.schema"
import logService from "src/services/logService"
import passwordService from "src/services/passwordService"
import redisService from "src/services/redisService"
import { COOKIE_OPTIONS } from "src/utils/constants"

export const signIn = async (req: FastifyRequest<{ Body: SignInType }>, res: FastifyReply) => {
  const user = await UserModel.findByUsername(req.body.username)

  if (user === null) {
    logService.sendLog({ device: req.userAgent, sus: true, msg: `non-existent username (${req.body.username}) from ip ${req.ip}` })
    return res.code(404).send({ msg: 'Username o contraseña inválida.' })
  }

  const samePassword = await passwordService.isSamePassword(req.body.password, user.password)

  if (samePassword) {
    const sessionId = await redisService.createSession(user)
    logService.sendLog({ device: req.userAgent, sus: false, msg: `${user.username} signed in successfully` })
    return res.code(200).setCookie('sessionId', sessionId, COOKIE_OPTIONS).send({ msg: '¡Sesión iniciada!' })
  } else {
    logService.sendLog({ device: req.userAgent, sus: true, msg: `wrong password for username (${req.body.username}) from ip ${req.ip}` })
    return res.code(404).send({ msg: 'Username o contraseña inválida.' })
  }
}

export const signUp = async (req: FastifyRequest<{ Body: SignUpType }>, res: FastifyReply) => {
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
  logService.sendLog({ device: req.userAgent, msg: `${newUser.username} signed up successfully` })
  return res.code(200).setCookie('sessionId', sessionId, COOKIE_OPTIONS).send({ msg: '¡Cuenta creada!' })
}

export const logOut = async (req: FastifyRequest, res: FastifyReply) => {
  // TODO: delete Redis session?
  logService.sendLog({ device: req.userAgent, msg: `${req.session.username} logged out successfully` })
  return res.code(200).clearCookie('sessionId', COOKIE_OPTIONS).send({ msg: 'Sesión cerrada' })
}