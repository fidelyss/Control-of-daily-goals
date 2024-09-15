import { db } from '../'
import { goals } from '../Schema'
interface CreateGoalsRequest {
    title: string,
    desiredWeeklyFrequency: number
}
export async function createGoal({ title, desiredWeeklyFrequency }: CreateGoalsRequest) {
    const result = await db.insert(goals).values(
        { title, desiredWeeklyFrequency }
    ).returning()
    const goal = result[0]
    return { goal }
}