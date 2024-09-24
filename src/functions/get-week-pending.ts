import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goalCompletions, goals } from '../db/Schema'
import { and, count, gte, lte, eq, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export async function getWeekpendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreateUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createAt: goals.createAt
        }).from(goals).where(lte(goals.createAt, lastDayOfWeek))
    )
    const goalsCompletionCounts = db.$with('goal_completion_counts').as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
        }).from(goalCompletions).where(and(
            gte(goalCompletions.createAt, firstDayOfWeek),
            lte(goalCompletions.createAt, lastDayOfWeek)
        )).groupBy(goalCompletions.goalId)
    )
    const pendingGoals = await db.with(goalsCreateUpToWeek, goalsCompletionCounts)
        .select({
            id: goalsCreateUpToWeek.id,
            title: goalsCreateUpToWeek.title,
            desiredWeeklyFrequency: goalsCreateUpToWeek.desiredWeeklyFrequency,
            completionCount: sql`
                COALESCE(${goalsCompletionCounts.completionCount},0)
            `.mapWith(Number),
        }
        )
        .from(goalsCreateUpToWeek).leftJoin(
            goalsCompletionCounts,
            eq(goalsCompletionCounts.goalId, goalsCreateUpToWeek.id)
        )
    return pendingGoals
}