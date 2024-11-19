import styled, { css, useTheme } from "styled-components"

import { getProjectColor } from "@components/project/common/palettes"
import SimpleProfile from "@components/social/common/SimpleProfile"
import LogDetails from "@components/social/logDetails/LogDetails"

import { getCurrentUsername } from "@api/client"

import { useClientLocale } from "@utils/clientSettings"
import useScreenType, { ifMobile } from "@utils/useScreenType"

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
    // TODO: explore feed용 view 추가하면 삭제
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)
    const tempSelectedDate = initial_date.toISOString()

    const theme = useTheme()
    const locale = useClientLocale()
    const { isMobile } = useScreenType()
    const { t } = useTranslation("", { keyPrefix: "social" })

    const me = getCurrentUsername()

    if (!log) return null

    const handleSelect = (e) => {
        if (e.target.dataset.accept === "true")
            setSelectedUser(log.username === selectedUser ? null : log.username)
    }

    const boxColor = getProjectColor(theme.type, log.header_color) || theme.grey
    // log.recent_task
    //     ? log.recent_task.is_read
    //         ? theme.grey
    //         :
    //     : null

    const backgroundColor =
        log.username === selectedUser
            ? theme.social.activeBackgroundColor
            : theme.backgroundColor

    return (
        <Frame $isMe={log.username === me} $bgColor={boxColor}>
            <FrameRow>
                <ProfileWrapper $isMe={log.username === me}>
                    <SimpleProfile user={log} />
                </ProfileWrapper>
            </FrameRow>
            <Username>
                @{log.username}
            </Username>
        </Frame>
    )

    // return (
    //     (isMobile || log.username !== me) && (
    //         <Frame
    //             onClick={handleSelect}
    //             $bgColor={backgroundColor}
    //             data-accept="true">
    //             {isMobile && log.username === selectedUser ? (
    //                 <MobileLogDetail data-accept="true">
    //                     <LogDetails
    //                         username={selectedUser}
    //                         selectedDate={selectedDate || tempSelectedDate}
    //                         pageType={pageType}
    //                     />
    //                 </MobileLogDetail>
    //             ) : (
    //                 <>
    //                     <SimpleProfile
    //                         user={log}
    //                         ringColor={setRingColor}
    //                         data-accept="true"
    //                     />
    //                     <RecentTask data-accept="true">
    //                         {log.recent_task && (
    //                             <>
    //                                 <TaskName data-accept="true">
    //                                     {' "' +
    //                                         putEllipsis(
    //                                             log.recent_task.name,
    //                                             32,
    //                                         ) +
    //                                         '" ' +
    //                                         t("log_preview_completed")}
    //                                 </TaskName>

    //                                 <Ago data-accept="true">
    //                                     {" " +
    //                                         DateTime.fromISO(
    //                                             log.recent_task.completed_at,
    //                                         )
    //                                             .setLocale(locale)
    //                                             .toRelative() +
    //                                         " "}
    //                                 </Ago>
    //                             </>
    //                         )}
    //                     </RecentTask>
    //                 </>
    //             )}
    //         </Frame>
    //     )
    // )
}

const Frame = styled.div`
    /* xa : xa/k     xb = 0.47xa */
    /* xb : xb/1.1  xb/1.1 = xa/k*/
    aspect-ratio: ${(props) => (props.$isMe ? 1.1/0.47 : 1.1)};
    width: ${(props) => (props.$isMe ? 100 : 47)}%;

    border-radius: 32px;
    background-color: ${(props) => props.$bgColor};
    box-sizing: border-box;
    padding: 1.5em 1.2em 1.2em 1.2em;

    display: flex;
    flex-direction: column;

    ${ifMobile} {
        aspect-ratio: ${(props) => (props.$isMe ? 1/0.47 : 1)};
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
    /* line-height: 1.5em; */
    overflow-x: clip;
    text-overflow: ellipsis;
    
    font-size: 1.1em;
    text-align: left;
    white-space: nowrap;
`

const SimpleStats = styled.div`

`

const RecentTask = styled.div`
    min-width: 40%;
    flex-grow: 1;

    padding-bottom: 0.7em;
    line-height: 1.3em;
`

const TaskName = styled.div`
    color: ${(p) => p.theme.textColor};
    display: inline;
    font-size: 1.1em;
`

const Ago = styled.span`
    margin-left: 0.5em;

    display: inline;

    font-size: 0.9em;
    color: ${(p) => p.theme.secondTextColor};
    white-space: nowrap;
`

const MobileLogDetail = styled.div`
    height: 70vh;
    width: 100%;

    overflow-y: scroll;
`

export default LogPreviewBox
