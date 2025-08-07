import type { Dispatch, SetStateAction } from "react"

import DailyUserProfile from "./DailyUserProfile"
import RecordContainer from "./RecordContainer"
import RemarkContainer from "./RemarkContainer"
import DateBar from "./common/DateBar"

import type { User } from "@api/users.api"

import { useClientTimezone } from "@utils/clientSettings"

import { DateTime } from "luxon"

interface DailyContainerProps {
    username: User["username"]
    date: DateTime
    setDate: Dispatch<SetStateAction<DateTime>>
    standalone?: boolean
}

export default function DailyContainer({
    username,
    date,
    setDate,
    standalone = false,
}: DailyContainerProps) {
    const tz = useClientTimezone()

    return (
        <>
            <DailyUserProfile username={username} back={standalone} />
            {standalone && (
                // TODO: replace DateBar
                <DateBar
                    selectedDate={date}
                    setSelectedDate={(selectedDate: string) =>
                        setDate(DateTime.fromISO(selectedDate).setZone(tz))
                    }
                />
            )}
            <RemarkContainer username={username} date={date} />
            <RecordContainer username={username} date={date} />
        </>
    )
}
