import dayjs from "dayjs"
import { db } from "../db"
import { goalCompletions, goals } from "../db/Schema"
import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear)

export const summary = async () => {
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
    const goalsCompletedInWeek = db.$with('goal_completion_counts').as(
        db.select({
            id: goalCompletions.goalId,
            title: goals.title,
            completedAt: goalCompletions.createAt,
            completedAtDate: sql`DATE(${goalCompletions.createAt})`.as('completedAtDate')
        }).from(goalCompletions)
            .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
            .where(
                and(
                    gte(goalCompletions.createAt, firstDayOfWeek),
                    lte(goalCompletions.createAt, lastDayOfWeek),
                )
            )
    )
    const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
        db.select({
            completedAtDate: goalsCompletedInWeek.completedAtDate,
            completions: sql`
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', ${goalsCompletedInWeek.id},
                        'title', ${goalsCompletedInWeek.title},
                        'completedAt', ${goalsCompletedInWeek.completedAt}
                    )
                )
            `.as('completions'),
        })
            .from(goalsCompletedInWeek)
            .groupBy(goalsCompletedInWeek.completedAtDate)

    )

    const goalsCompletedByWeekDayResult = await db.with(goalsCreateUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
        .select()
        .from(goalsCompletedByWeekDay)

    return goalsCompletedByWeekDayResult
}