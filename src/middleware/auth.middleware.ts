import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import redisService, { TimbrameSession } from "src/services/redisService";
import { COOKIE_OPTIONS } from "src/utils/constants";

export const isAuthenticated = (server: FastifyInstance) => {
  return async (req: FastifyRequest, res: FastifyReply) => {
    server.log.info(`session cookie '${req.cookies.sessionId}' from ${req.ip}`)

    if (!req.cookies.sessionId) {
      server.log.error(`unauthenticated request from ${req.ip}`)
      res.code(403).send({ msg: 'Unauthenticated' })
    }

    const unsignedCookie = server.unsignCookie(req.cookies.sessionId as string)

    if (unsignedCookie.valid === false || unsignedCookie.value === null) {
      server.log.error(`tampered cookie request from ${req.ip}`)
      return res.code(403).send({ msg: 'Malformed cookie' })
    }

    const session = await redisService.getSession(unsignedCookie.value as string)

    if (session === null) {
      return res.code(404).clearCookie('sessionId', COOKIE_OPTIONS).send({ msg: 'Sesión expiró' })
    }

    req.session = session
  }
}