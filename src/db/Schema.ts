import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const goals = pgTable('goals', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
    createAt: timestamp('create_at', { withTimezone: true }).notNull().defaultNow()
})
export const goalCompletions = pgTable('goal_completion', {
    id: text('id').primaryKey().notNull().$defaultFn(() => createId()),
    goalId: text('goal_id').references(() => goals.id),
    createAt: timestamp('create_at', { withTimezone: true }).notNull().defaultNow()
})