import { CloudWatchLogsClient, PutLogEventsCommand } from "@aws-sdk/client-cloudwatch-logs";
import envService from './envService'
import { logger } from "src";

class LogService {
  private client: CloudWatchLogsClient

  constructor() {
    this.client = new CloudWatchLogsClient({ region: 'sa-east-1', credentials: { accessKeyId: envService.getString('ACCESS_KEY_ID'), secretAccessKey: envService.getString('ACCESS_KEY_SECRET') } })
  }

  async sendLog(log: Record<string, unknown>) {
    try {
      const command = new PutLogEventsCommand({ logGroupName: 'timbrame/rest', logStreamName: 'timbrame-events', logEvents: [{ timestamp: new Date().getTime(), message: JSON.stringify(log) }] })
      const data = await this.client.send(command)
      logger.info(`data from CloudWatch: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      logger.info(`error from CloudWatch: ${JSON.stringify(error, null, 2)}`)
    }
  }
}

export default new LogService()
