import { useNavigate } from "react-router-dom"

import styled, { css, useTheme } from "styled-components"

import { getProjectColor } from "@components/project/common/palettes"
import SimpleProfile from "@components/social/common/SimpleProfile"

import { getCurrentUsername } from "@api/client"

import { useClientLocale } from "@utils/clientSettings"
import useScreenType, { ifMobile } from "@utils/useScreenType"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const LogPreviewBox = ({
    log,
    selectedUser,
    setSelectedUser,
    selectedDate,
    pageType = "following",
}) => {
    const theme = useTheme()
    const locale = useClientLocale()
    const { isMobile } = useScreenType()
    const { t } = useTranslation("", { keyPrefix: "social" })
    const navigate = useNavigate()

    const me = getCurrentUsername()

    if (!log) return null

    // TODO: explore feed용 view 추가하면 삭제
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)
    const tempSelectedDate = initial_date.toISOString()

    const handleSelect = (e) => {
        setSelectedUser(log.username === selectedUser ? null : log.username)

        if (isMobile) navigate(`../daily/@${log.username}`)
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
    aspect-ratio: ${(props) => (props.$isMe ? 1.1 / 0.47 : 1.1)};
    width: ${(props) => (props.$isMe ? 100 : 47)}%;

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
        aspect-ratio: ${(props) => (props.$isMe ? 1 / 0.47 : 1)};
        padding: 1em;
    }
`

const FrameRow = styled.div`
    display: flex;
    flex-direction: row;
`

const ProfileWrapper = styled.div`
    aspect-ratio: 1;
    max-width: 4.1em;

    ${(props) =>
        props.$isMe
            ? css`
                  /* ((100% + padding) * box_width - padding) * width */
                  width: calc(((100% + 2.4em) * 0.47 - 2.4em) * 0.5);
              `
            : css`
                  width: 50%;
              `}
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
    gap: 0.5em;
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
        margin: 0.1rem 0;

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
    line-height: 1.3em;
    overflow-x: clip;
    text-overflow: ellipsis;

    font-size: 1.1em;
`

export default LogPreviewBox
