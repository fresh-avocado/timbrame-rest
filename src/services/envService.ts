import dotenv from 'dotenv'

class EnvService {
  constructor() {
    dotenv.config()
  }

  getString(key: string): string {
    const value = process.env[key]
    if (value === undefined) {
      throw new Error(`env var ${key} is not defined!`)
    }
    return value
  }

  isProd(): boolean {
    return this.getString('NODE_ENV') === 'production'
  }

  isDev(): boolean {
    return !this.isProd();
  }

  getNumber(key: string): number {
    const value = process.env[key]
    if (value === undefined) {
      throw new Error(`env var ${key} is not defined!`)
    }
    return +value
  }
}

export default new EnvService()
