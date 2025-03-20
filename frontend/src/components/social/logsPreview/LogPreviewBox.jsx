import { useNavigate } from "react-router-dom"

import styled, { css, useTheme } from "styled-components"

import SimpleProfile from "@components/social/common/SimpleProfile"

import { getCurrentUsername } from "@api/client"

import useScreenType, { ifMobile, ifTablet } from "@utils/useScreenType"

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
    const { isMobile, isTablet } = useScreenType()
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
            $isDesktop={!(isMobile || isTablet)}
            onClick={handleSelect}>
            <FrameRow>
                <ProfileWrapper $isMe={log.username === me}>
                    <SimpleProfile user={log} />
                </ProfileWrapper>
            </FrameRow>

            <InfoContainer>
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
            </InfoContainer>
        </Box>
    )
}

const Box = styled.div`
    box-sizing: border-box;
    ${(props) =>
        props.$isMe
            ? css`
                  width: 100%;
                  aspect-ratio: 2 / 1;
              `
            : css`
                  width: calc(50% - ${props => props.$isDesktop ? 0.75 : 0.5}em);
                  aspect-ratio: 1/1;
              `}
    padding: 7.5%;

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
    justify-content: space-between;

    transition: all 0.25s ease;

    &:hover {
        box-shadow:
            0 0 0 0.15em ${(p) => p.theme.backgroundColor},
            0 0 0 0.3em ${(props) => props.$bgColor};
    }

    ${ifMobile} {
        padding: 1.5em !important;

        &:hover {
            box-shadow: none;
        }
    }

    ${ifTablet} {
        padding: 1.5em !important;
    }
`

const FrameRow = styled.div`
    display: flex;
    flex-direction: row;
`

const ProfileWrapper = styled.div`
    aspect-ratio: 1;
    ${(props) =>
        props.$isMe
            ? css`
                  width: calc((50% - 1.5em) * 0.45);
              `
            : css`
                  width: 45%;
              `};

    ${ifMobile} {
        max-width: 64px;
    }

    ${ifTablet} {
        max-width: 64px;
    }
`

const InfoContainer = styled.div`
    flex-grow: 1;
    max-height: 3em;
    
    display: flex;
    flex-direction: column;
    gap: 1em;
`

const Username = styled.div`
    font-weight: 600;
    overflow-x: clip;
    text-overflow: ellipsis;

    text-align: left;
    white-space: nowrap;
`

const SimpleStats = styled.div`
    height: 1.5em;

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
