import { useState } from "react"

import { useClientLocale, useClientTimezone } from "@utils/clientSettings"
import { skeletonCSS } from "@assets/skeleton"

import { DateTime } from "luxon"
import styled, { css } from "styled-components"

const Ago = ({created_at, skeleton=false}) => {
    const [isHover, setIsHover] = useState(false)

    const locale = useClientLocale()
    const tz = useClientTimezone()
    const datetime = DateTime.fromISO(created_at).setLocale(locale).setZone(tz)


    return <Container>
        <Time
            $skeleton={skeleton}
            dateTime={created_at}
            onMouseEnter={e => setIsHover(true)}
            onMouseLeave={e => setIsHover(false)}
        >
            {!skeleton && isHover ? datetime.toLocaleString(DateTime.DATETIME_MED) : datetime.toRelative()}
        </Time>
    </Container>
}

const Container = styled.div`
    flex-grow: 2; 

    display: flex;
    justify-content: right;
`

const Time = styled.time`
    font-size: 0.75em;
    display: block;
    word-break: keep-all;
    white-space: nowrap;

    ${props => props.$skeleton && css`
        width: 70px;
        height: 1em;
        ${skeletonCSS} 
    `}
`

export default Ago
