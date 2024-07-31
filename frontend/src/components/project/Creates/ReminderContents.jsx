import { useState, useEffect } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import LoaderCircle from "@components/common/LoaderCircle"

const ReminderIcons = ({ item, reminders, handleReminder, ReminderID }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isHovering, setIsHovering] = useState(false)

    const clickReminder = (delta) => {
        return async () => {
            if (isLoading) {
                return
            }
            if (handleReminder(delta)) { //알람 설정을 할 수 없을 때
                setIsLoading(false)
                return
            }
            setIsLoading(true)
        }
    }

    useEffect(() => {
        setIsLoading(false)
    }, [reminders])
    
    return (
        <ItemBlock>
            {item.icon}
            <ItemText
                onClick={clickReminder(item.delta)}
                onMouseOver={() => setIsHovering(true)}
                onMouseOut={() => setIsHovering(false)}
            >
                {item.content}
            </ItemText>
            {(isLoading) ? <LoaderCircle/> :
            ((ReminderID) ? ((isHovering) ? <FeatherIcon icon="x"/> : <FeatherIcon icon="check"/>) : null )}
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
        stroke: ${p => p.theme.project.danger};
        stroke-width: 3;
        top: 0em;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: ${p=>p.theme.textColor};
    cursor: pointer;

    &:hover {
        font-weight: bolder;
        color: ${p => p.theme.goose};
    }
`

export default ReminderIcons