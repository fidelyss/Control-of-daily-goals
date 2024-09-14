import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
    schema: "./src/db/Schema.ts",
    out: "./.migrations",
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL
    }
})
