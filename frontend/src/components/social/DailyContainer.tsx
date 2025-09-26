import type { Dispatch, SetStateAction } from "react"

import styled from "styled-components"

import DailyUserProfileContainer from "@components/social/DailyUserProfileContainer"
import RecordContainer from "@components/social/RecordContainer"
import RemarkContainer from "@components/social/RemarkContainer"
import DateBar from "@components/social/common/DateBar"
import FollowButton from "@components/users/FollowButton"

import type { User } from "@api/users.api"

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
    return (
        <Container className={className}>
            <DailyUserProfileContainer username={username} back={standalone} />
            {displayFollowButton && <FollowButton username={username} />}
            {standalone && <DateBar date={date} setDate={setDate} />}
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
