import { ReactNode, useState } from "react"

import styled from "styled-components"

import { type TaskReminderDelta } from "@api/notifications.api"

import { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"

const ReminderContents = ({
    item,
    reminders,
    handleReminder,
}: {
    item: {
        id: number
        icon: ReactNode
        content: string
        delta: number
    }
    reminders: TaskReminderDelta[] | undefined
    handleReminder: (delta: number) => void
}) => {
    const [isHovering, setIsHovering] = useState(false)

    return (
        <ItemBlock>
            {item.icon}
            <ItemText
                onClick={() => handleReminder(item.delta)}
                onMouseOver={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}>
                {item.content}
            </ItemText>
            {reminders?.some((r) => r.delta === item.delta) ? (
                isHovering ? (
                    <FeatherIcon icon="x" />
                ) : (
                    <FeatherIcon icon="check" />
                )
            ) : null}
        </ItemBlock>
    )
}

const ItemBlock = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    & svg {
        stroke: ${(p) => p.theme.project.danger};
        stroke-width: 3;
        top: 0em;
    }

    ${ifMobile} {
        margin-left: 0.1em;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: ${(p) => p.theme.textColor};
    cursor: pointer;

    &:hover {
        font-weight: bolder;
        color: ${(p) => p.theme.goose};
    }
`

export default ReminderContents
