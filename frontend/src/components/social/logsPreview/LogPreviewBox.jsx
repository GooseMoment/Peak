import { useNavigate } from "react-router-dom"

import styled, { css, useTheme } from "styled-components"

import SimpleProfile from "@components/social/common/SimpleProfile"

import { getCurrentUsername } from "@api/client"

import useScreenType, { ifMobile } from "@utils/useScreenType"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"

const LogPreviewBox = ({
    log,
    selectedUser,
    setSelectedUser,
    selectedDate,
    // pageType = "following",
}) => {
    const theme = useTheme()
    const { isMobile } = useScreenType()
    const navigate = useNavigate()

    const me = getCurrentUsername()

    if (!log) return null

    // TODO: explore feed용 view 추가하면 삭제
    const initialDate = new Date()
    initialDate.setHours(0, 0, 0, 0)
    // const tempSelectedDate = initial_date.toISOString()

    const handleSelect = () => {
        setSelectedUser(log.username === selectedUser ? null : log.username)

        if (isMobile)
            navigate(`../daily/@${log.username}`, {
                state: { selectedDate: selectedDate },
            })
    }

    const boxColor =
        getPaletteColor(theme.type, log?.header_color) || theme.grey

    return (
        <Box
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
                    <StatusIconWrapper $type="completedTask">
                        <FeatherIcon icon="check" />
                    </StatusIconWrapper>
                    <StatusCount>12</StatusCount>
                </StatsUnit>
                <StatsUnit>
                    <StatusIconWrapper $type="reaction">
                        <FeatherIcon icon="heart" />
                    </StatusIconWrapper>
                    <StatusCount>12</StatusCount>
                </StatsUnit>
            </SimpleStats>
        </Box>
    )
}

const Box = styled.div`
    box-sizing: border-box;
    ${(props) =>
        props.$isMe
            ? css`
                  width: 100%;
                  aspect-ratio: 2 / 0.9;
              `
            : css`
                  width: calc(50% - 0.5em);
                  aspect-ratio: 1/1;
              `}
    padding: max(5%, 12px);

    background-color: ${(props) => props.$bgColor};
    border-radius: 16px;
    ${(props) =>
        props.$isSelected &&
        css`
            box-shadow:
                0 0 0 0.15em ${(p) => p.theme.backgroundColor},
                0 0 0 0.3em ${(p) => p.theme.textColor} !important;
        `}

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.7em;

    transition: all 0.25s ease;

    &:hover {
        box-shadow:
            0 0 0 0.15em ${(p) => p.theme.backgroundColor},
            0 0 0 0.3em ${(props) => props.$bgColor};
    }

    ${ifMobile} {
        &:hover {
            box-shadow: none;
        }
    }
`

const FrameRow = styled.div`
    display: flex;
    flex-direction: row;
`

const ProfileWrapper = styled.div`
    aspect-ratio: 1;
    width: 60px;
`

const Username = styled.div`
    font-size: 1em;
    font-weight: 600;
    overflow-x: clip;
    text-overflow: ellipsis;

    text-align: left;
    white-space: nowrap;
`

const SimpleStats = styled.div`
    height: 20px;

    display: flex;
    flex-direction: row;
    gap: 1em;
`

const StatsUnit = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.3em;
`

const StatusIconWrapper = styled.div`
    box-sizing: border-box;
    aspect-ratio: 1;
    width: 18px;
    padding: 0;

    ${(props) =>
        props.$type === "completedTask" &&
        css`
            border: 2px solid ${(p) => p.theme.black};
            border-radius: 50%;
        `}

    display: flex;
    justify-content: center;
    align-items: center;

    & svg {
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0;

        stroke: ${(p) => p.theme.black};
        stroke-width: 3px;
        ${(props) =>
            props.$type === "reaction" &&
            css`
                fill: ${(p) => p.theme.black};
            `}
    }
`

const StatusCount = styled.div`
    overflow-x: clip;
    text-overflow: ellipsis;
`

export default LogPreviewBox
