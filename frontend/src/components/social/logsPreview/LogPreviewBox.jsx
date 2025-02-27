import { useNavigate } from "react-router-dom"

import styled, { css, useTheme } from "styled-components"

import SimpleProfile from "@components/social/common/SimpleProfile"

import { getCurrentUsername } from "@api/client"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import { getPaletteColor } from "@assets/palettes"

import { DateTime } from "luxon"
import { useTranslation } from "react-i18next"

const putEllipsis = (text, maxLength) => {
    return text.length > maxLength
        ? text.substring(0, maxLength - 3) + "..."
        : text
}

const LogPreviewBox = ({
    log,
    selectedUser,
    setSelectedUser,
    selectedDate,
    pageType = "following",
}) => {
    const theme = useTheme()
    const { isMobile } = useScreenType()
    const navigate = useNavigate()

    const me = getCurrentUsername()

    if (!log) return null

    // TODO: explore feed용 view 추가하면 삭제
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)
    const tempSelectedDate = initial_date.toISOString()

    const handleSelect = (e) => {
        setSelectedUser(log.username === selectedUser ? null : log.username)

        if (isMobile)
            navigate(`../daily/@${log.username}`, {
                state: { selectedDate: selectedDate },
            })
    }

    const boxColor =
        getProjectColor(theme.type, log?.header_color) || theme.grey

    return (
        <Frame
            $isMe={log.username === me}
            $bgColor={boxColor}
            $isSelected={log.username === selectedUser}
            onClick={handleSelect}>
            <FrameRow>
                <ProfileWrapper $isMe={log.username === me}>
                    <SimpleProfile user={log} />
                </ProfileWrapper>
            </FrameRow>
            <Username>@{log.username}</Username>
            
            <SimpleStats>
                <StatsUnit>
                    <StatusIconWrapper $type={"completedTask"}>
                        <FeatherIcon icon="check" />
                    </StatusIconWrapper>
                    <StatusCount>12</StatusCount>
                </StatsUnit>
                <StatsUnit>
                    <StatusIconWrapper $type={"reaction"}>
                        <FeatherIcon icon="heart" />
                    </StatusIconWrapper>
                    <StatusCount>12</StatusCount>
                </StatsUnit>
            </SimpleStats>
        </Frame>
    )
}

const Frame = styled.div`
    /* xa : xa/k     xb = 0.47xa */
    /* xb : xb/1.1  xb/1.1 = xa/k*/
    aspect-ratio: ${(props) => (props.$isMe ? 1.1 / 0.45 : 1.1)};
    width: ${(props) => (props.$isMe ? 100 : 45)}%;

    border-radius: 16px;
    box-sizing: border-box;
    ${(props) =>
        props.$isSelected &&
        css`
            box-shadow:
                0 0 0 0.15em ${(p) => p.theme.backgroundColor},
                0 0 0 0.3em ${(p) => p.theme.textColor} !important;
        `}
    background-color: ${(props) => props.$bgColor};
    padding: 1.5em 1.2em 1.2em 1.2em;

    display: flex;
    flex-direction: column;
    row-gap: 0.1em;

    transition: all 0.5s ease;

    &:hover {
        box-shadow:
            0 0 0 0.15em ${(p) => p.theme.backgroundColor},
            0 0 0 0.3em ${(props) => props.$bgColor};
    }

    ${ifMobile} {
        aspect-ratio: ${(props) => (props.$isMe ? 1 / 0.45 : 1)};
        padding: 1em;
    }
`

const FrameRow = styled.div`
    display: flex;
    flex-direction: row;
`

const ProfileWrapper = styled.div`
    aspect-ratio: 1;
    max-width: 2.1rem;

    ${(props) =>
        props.$isMe
            ? css`
                  /* ((100% + padding) * box_width - padding) * width */
                  width: calc(((100% + 2.4em) * 0.45 - 2.4em) * 0.5);
              `
            : css`
                  width: 50%;
              `}

    ${ifMobile} {
        max-width: 3.2rem;
    }
`

const Username = styled.div`
    /* display: inline; */
    line-height: 1.3em;
    overflow-x: clip;
    text-overflow: ellipsis;

    font-size: 1.1em;
    text-align: left;
    white-space: nowrap;
`

const SimpleStats = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: row;
`

const StatsUnit = styled.div`
    width: 50%;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.3em;
`

const StatusIconWrapper = styled.div`
    aspect-ratio: 1;
    width: 1.2em;

    ${(props) =>
        props.$type === "completedTask" &&
        css`
            border: 3px solid ${(p) => p.theme.black};
            border-radius: 50%;
        `}

    display: flex;
    justify-content: center;

    & svg {
        aspect-ratio: 1;
        width: ${(props) => (props.$type === "completedTask" ? 83 : 100)}%;
        top: 0;
        margin: 0.1em 0;

        stroke: ${(p) => p.theme.black};
        stroke-width: 0.2em;
        ${(props) =>
            props.$type === "reaction" &&
            css`
                fill: ${(p) => p.theme.black};
            `}
    }
`

const StatusCount = styled.div`
    line-height: 1.2em;
    overflow-x: clip;
    text-overflow: ellipsis;

    font-size: 1.1em;

    ${ifMobile} {
        font-size: 1em;
    }
`

export default LogPreviewBox
