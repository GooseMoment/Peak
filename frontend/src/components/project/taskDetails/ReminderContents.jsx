import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import { ifMobile } from "@utils/useScreenType"

const ReminderContents = ({ item, reminders, handleReminder }) => {
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
            {reminders.includes(item.delta) ? (
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
