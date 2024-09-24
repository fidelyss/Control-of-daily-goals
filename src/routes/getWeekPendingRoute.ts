import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekpendingGoals } from '../functions/get-week-pending'
export const getWeekPendingRoute: FastifyPluginAsyncZod = async (app) => {
    app.get('/pending-goals', async () => {
        const sql = await getWeekpendingGoals()
        const json = sql.map(titles => titles.title)
        console.log(json)
        return sql
    })

}