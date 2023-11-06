import { FastifyInstance, FastifyRequest } from 'fastify'
import { FriendsSchema, FriendsType, RequestSchema, RequestType } from './friends.schema'
import { ResponseSchema } from '../../utils/error.schema'
import { COOKIE_OPTIONS } from '../../utils/constants'
import { isAuthenticated } from '../../middleware/auth.middleware'
import { UserModel, RequestModel } from '../../models/models'
import passwordService from 'src/services/passwordService'
import redisService from 'src/services/redisService'

export const friendsPath = '/friends'

const routes = async (server: FastifyInstance): Promise<void> => {

  server.post('/postRequest', { schema: { body: RequestSchema, response: { 201: ResponseSchema } } }, async (req: FastifyRequest<{ Body: RequestType }>, res) => {
    const userFrom = await UserModel.findByUsername(req.body.from)
    if (userFrom === null) {
      return res.code(404).send({ msg: 'Friendship request sender not found.' })
    }

    const userTo = await UserModel.findByUsername(req.body.to)
    if (userTo === null) {
      return res.code(404).send({ msg: 'Friendship request receiver of  not found.' })
    }

    const newRequest = await RequestModel.insert({
      from: userFrom._id,
      to: userTo._id,
      status: 'send'
    })

    return res.code(200).send({ msg: 'Request created' })
  })

  server.get('/getFriends', { schema: { body: FriendsSchema, response: { 200: ResponseSchema } } }, async (req: FastifyRequest<{ Body: FriendsType }>, res) => {
    const user = await UserModel.findByUsername(req.body.username)
    if (user === null) {
      return res.code(404).send({ msg: 'Username not found.' })
    }
    return res.code(200).send({ msg: user.friends })
  })

  server.get('/getIncomingRequests', { schema: { body: FriendsSchema, response: { 200: ResponseSchema } } }, async (req: FastifyRequest<{ Body: FriendsType }>, res) => {
    const user = await UserModel.findByUsername(req.body.username)
    if (user === null) {
      return res.code(404).send({ msg: 'Username not found.' })
    }
    const incomingRequest = await RequestModel.findByIncoming(user._id)
    return res.code(200).send({ msg: incomingRequest })
  })

  server.get('/getOutgoingRequests', { schema: { body: FriendsSchema, response: { 200: ResponseSchema } } }, async (req: FastifyRequest<{ Body: FriendsType }>, res) => {
    const user = await UserModel.findByUsername(req.body.username)
    if (user === null) {
      return res.code(404).send({ msg: 'Username not found.' })
    }
    const outgoingRequest = await RequestModel.findByOutgoing(user._id)
    return res.code(200).send({ msg: outgoingRequest })
  })

}

export default routes
