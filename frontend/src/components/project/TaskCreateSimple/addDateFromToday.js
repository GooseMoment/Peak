import { useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

const addDateFromToday = (set) => {
    const tz = useClientTimezone()

    const today = DateTime.now().setZone(tz)
    const date = today.plus(set)

    let calculatedDate = null
    if (!(set === null)) {
        calculatedDate = date.toISODate()
    }
    return calculatedDate
}

export default addDateFromToday
