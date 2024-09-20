const addDateFromToday = (set) => {
    let date = new Date()
    date.setDate(date.getDate() + set)

    let calculatedDate = null
    if (!(set === null)) {
        calculatedDate = date.toISOString().slice(0, 10)
    }
    return calculatedDate
}

export default addDateFromToday
