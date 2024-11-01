import { getClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

const addDateFromToday = (set) => {
    if (!set) {
        return null
    }

    const tz = getClientTimezone()
    return DateTime.now().setZone(tz).plus(set).toISODate()
}

export default addDateFromToday
