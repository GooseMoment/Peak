import { DateTime } from "luxon"

const construct = (diffDays: number) =>
    DateTime.now().plus({ days: diffDays }).toISODate()

export const today = construct(0)
export const yesterday = construct(-1)
export const tomorrow = construct(1)
export const dayAfterTomorrow = construct(2)
export const dayLongAfter = construct(20)
export const nextWeek = construct(7)
export const twoWeeksLater = construct(14)
