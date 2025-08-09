import { useClientTimezone } from "./clientSettings"
import useParamState from "./useParamState"

import { DateTime } from "luxon"

export default function useDateParamState({
    navigate,
}: {
    navigate: (date: DateTime, fallback: boolean) => void
}) {
    const tz = useClientTimezone()

    return useParamState<DateTime>({
        name: "date",
        fallback: () =>
            DateTime.now()
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                .setZone(tz),
        convert: (param) => {
            if (!param) {
                return
            }

            const date = DateTime.fromISO(param, { zone: tz })
            return date.isValid ? date : undefined
        },
        navigate,
    })
}
