import fastify from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { createGoalCompletionRoute } from "../routes/createGoalCompletionRoute"
import { createGoalsRoute } from "../routes/createGoalsRoute"
import { getWeekPendingRoute } from "../routes/getWeekPendingRoute"
import { summaryRoute } from "../routes/summaryRoute"
const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.listen({ port: 3333 }).then(() => {
    console.log('hello w')
})
app.register(createGoalCompletionRoute)
app.register(getWeekPendingRoute)
app.register(createGoalsRoute)
app.register(summaryRoute)



