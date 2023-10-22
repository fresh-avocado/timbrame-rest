import { FastifyServerOptions } from "fastify"
import envService from "./envService"

class ConfigService {
  getLoggerConfig(): FastifyServerOptions['logger'] {
    if (envService.isDev()) {
      return {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname,reqId',
          },
        }
      }
    } else {
      return true
    }
  }

  getAddress() {
    if (envService.isDev()) {
      return '127.0.0.1'
    } else {
      return '0.0.0.0'
    }
  }
}

export default new ConfigService()
