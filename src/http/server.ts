import fastify from "fastify";
const app = fastify()
app.listen({ port: 3333 }).then(() => {
    console.log('hello w')
})
app.get('/get', () => console.log('getbddf'))