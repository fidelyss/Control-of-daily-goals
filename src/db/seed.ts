import { client, db } from '.'
import { goalCompletions, goals } from './Schema'
import dayjs from 'dayjs'
const starOfWeek = dayjs().startOf('week')
async function seed() {
    await db.delete(goalCompletions)
    await db.delete(goals)
    const goalsResult = await db.insert(goals).values([
        { title: "Acordar sedo", desiredWeeklyFrequency: 1 },
        { title: "Me exercitar", desiredWeeklyFrequency: 2 },
        { title: "Meditar", desiredWeeklyFrequency: 1 },
    ]).returning()
    await db.insert(goalCompletions).values([
        { goalId: goalsResult[0].id, createAt: starOfWeek.toDate() },
        { goalId: goalsResult[1].id, createAt: starOfWeek.add(1, 'day').toDate() },
        { goalId: goalsResult[2].id, createAt: starOfWeek.add(3, 'day').toDate() }
    ])
}
seed().finally(() => {
    client.end()
})