import { FastifyReply, FastifyRequest } from "fastify";
import client from 'prom-client'

export const getMetrics = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const metrics = await client.register.metrics();
    return res.send(metrics);
  } catch (error) {
    return res.status(500).send({ error });
  }
}
