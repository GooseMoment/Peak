export const today = new Date()

export const yesterday = new Date()
yesterday.setDate(today.getDate() - 1)

export const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)

export const dayAfterTomorrow = new Date()
dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

export const dayLongAfter = new Date()
dayLongAfter.setDate(today.getDate() + 20)

export const nextWeek = new Date()
nextWeek.setDate(today.getDate() + 8)

export const twoWeeksLater = new Date()
twoWeeksLater.setDate(today.getDate() + 15)
