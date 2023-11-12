import { createClient } from "redis"
import envService from "./envService"
import { UserLeanDocument } from "src/models/User.model"
import { SESSION_MAX_AGE } from "src/utils/constants"

export type TimbrameSession = {
  username: string
}

class RedisService {
  private client!: ReturnType<typeof createClient>

  async connect() {
    return new Promise<void>((resolve, reject) => {
      createClient({
        password: envService.getString('REDIS_PASSWORD'),
        socket: {
          host: envService.getString('REDIS_HOST'),
          port: envService.getNumber('REDIS_PORT'),
        },
      }).on('error', (err) => {
        console.log('Error connecting to Redis client: ', err)
        reject()
      }).connect().then((value) => {
        this.client = value;
        resolve();
      }).catch((err) => {
        console.log('Error connecting to Redis client: ', err)
        reject();
      })
    })

  }

  async createSession({ _id, username }: Pick<UserLeanDocument, '_id' | 'username'>) {
    // TODO: use a JSON store to set specific fields (track user device, user active sessions, etc)
    try {
      const sessionId = _id.toString()
      await this.client.set(sessionId, JSON.stringify({ username } as TimbrameSession), {
        EX: SESSION_MAX_AGE, // expire the session in 5 mins
        NX: true, // only set the session if it doesn't exist
      })
      return sessionId
    } catch (error) {
      console.log(`createSession: ${JSON.stringify(error, null, 2)}`)
      throw error
    }
  }

  async getSession(sessionId: string) {
    const res = await this.client.get(sessionId)
    return res !== null ? JSON.parse(res) as TimbrameSession : null
  }

  async deleteSession(sessionId: string) {
    try {
      await this.client.del(sessionId)
    } catch (error) {
      console.log(`deleteSession: ${JSON.stringify(error, null, 2)}`)
      throw error
    }
  }

}

export default new RedisService()
