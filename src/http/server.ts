import fastify from "fastify";
import { z } from 'zod'
import { createGoal } from "../db/functions/create-goals";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { getWeekpendingGoals } from "../db/functions/get-week-pending";
import { createGoalCompletion } from "../db/functions/create-goal-completion";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.listen({ port: 3333 }).then(() => {
    console.log('hello w')
})

app.get('/pending-goals', async () => {
    const sql = await getWeekpendingGoals()
    return sql
})

app.post('/goal', {
    schema: {
        body: z.object({
            title: z.string(),
            desiredWeeklyFrequency: z.number().int().min(1).max(7)
        })
    }
}, async request => {
    const { title, desiredWeeklyFrequency } = request.body
    await createGoal({
        title,
        desiredWeeklyFrequency
    })
})

app.post('/completions', {
    schema: {
        body: z.object({
            goalId: z.string(),
        })
    }
}, async request => {
    const { goalId } = request.body
    const result = await createGoalCompletion({
        goalId,
    })
    return result
})