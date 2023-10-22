import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export const isAuthenticated = (server: FastifyInstance) => {
  return (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    server.log.info(`session cookie '${req.cookies.sessionId}' from ${req.ip}`)

    if (!req.cookies.sessionId) {
      server.log.error(`unauthenticated request from ${req.ip}`)
      reply.code(403).send({ msg: 'Unauthenticated' })
    }

    const unsignedCookie = server.unsignCookie(req.cookies.sessionId as string)

    if (unsignedCookie.valid === false) {
      server.log.error(`tampered cookie request from ${req.ip}`)
      reply.code(403).send({ msg: 'Malformed cookie' })
    }

    done()
  }
}