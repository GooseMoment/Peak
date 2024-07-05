export const today = new Date()

export const yesterday = new Date()
yesterday.setDate(today.getDate() - 1)

export const tomorrow = new Date()
tomorrow.setDate(today.getDate() + 1)

export const dayAfterTomorrow = new Date()
dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

export const dayLongAfter = new Date()
dayLongAfter.setDate(today.getDate() + 20)
