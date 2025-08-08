import type { Dispatch, SetStateAction } from "react"

import styled from "styled-components"

import FollowButton from "@components/users/FollowButton"

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
    setDate?: Dispatch<SetStateAction<DateTime>>
    displayFollowButton?: boolean
    className?: string
    standalone?: false
}

interface DailyContainerPropsStandalone {
    username: User["username"]
    date: DateTime
    setDate: Dispatch<SetStateAction<DateTime>>
    displayFollowButton?: boolean
    className?: string
    standalone: true
}

export default function DailyContainer({
    username,
    date,
    setDate,
    displayFollowButton = false,
    standalone,
    className,
}: DailyContainerProps | DailyContainerPropsStandalone) {
    const tz = useClientTimezone()

    return (
        <Container className={className}>
            <DailyUserProfile username={username} back={standalone} />
            {displayFollowButton && <FollowButton username={username} />}
            {standalone && (
                // TODO: edit after typing DateBar
                <DateBar
                    selectedDate={date}
                    setSelectedDate={(selectedDate: string) =>
                        setDate(DateTime.fromISO(selectedDate).setZone(tz))
                    }
                />
            )}
            <RemarkContainer username={username} date={date} />
            <RecordContainer username={username} date={date} />
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;
`
