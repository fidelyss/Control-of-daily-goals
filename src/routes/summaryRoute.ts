import type { FastifyPluginAsync } from "fastify";
import { summary } from "../functions/summary";
export const summaryRoute: FastifyPluginAsync = async app => {
    app.get('/summary', async () => {
        return await summary()
    })
}