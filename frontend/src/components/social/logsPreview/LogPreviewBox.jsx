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
        getPaletteColor(theme.type, log?.header_color) || theme.grey

    return (
        <Box
            $isMe={log.username === me}
            $bgColor={boxColor}
            $isSelected={log.username === selectedUser}
            $isMobile={isMobile}
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
        </Box>
    )
}

const Box = styled.div`
    box-sizing: border-box;
    /* xa : xa/k     xb = 0.47xa */
    /* xb : xb/1.1  xb/1.1 = xa/k*/
    aspect-ratio: ${(props) => (props.$isMe ? 1.0 / 0.45 : 1.0)};
    ${(props) =>
        props.$isMe
            ? css`
                  width: 100%;
              `
            : css`
                  width: calc(50% - 0.5em);
              `}
    padding: max(7.5%, 16px);

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
    align-content: space-between;
    justify-content: center;
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
    min-width: 50px;
    width: 50px;

    ${ifMobile} {
        max-width: 50px;
    }
`

const Username = styled.div`
    /* display: inline; */
    font-size: 1.1em;
    overflow-x: clip;
    text-overflow: ellipsis;

    text-align: left;
    white-space: nowrap;
`

const SimpleStats = styled.div`
    height: 20px;

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
    box-sizing: border-box;
    aspect-ratio: 1;
    width: 18px;
    padding: 0;

    ${(props) =>
        props.$type === "completedTask" &&
        css`
            border: 3px solid ${(p) => p.theme.black};
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
