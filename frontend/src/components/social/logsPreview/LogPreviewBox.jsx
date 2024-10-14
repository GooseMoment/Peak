import styled, { useTheme } from "styled-components"

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
    pageType="following"
}) => {
    // TODO: explore feed용 view 추가하면 삭제
    const initial_date = new Date()
    initial_date.setHours(0, 0, 0, 0)
    const tempSelectedDate = initial_date.toISOString()

    const theme = useTheme()
    const { t } = useTranslation("", { keyPrefix: "social" })
    const locale = useClientLocale()

    const me = getCurrentUsername()

    const isMobile = useScreenType().isMobile

    if (!log) return null

    const handleSelect = (e) => {
        if (e.target.dataset.accept === 'true')
            setSelectedUser(log.username === selectedUser ? null : log.username)
    }

    const setRingColor = () => {
        return log.recent_task
            ? log.recent_task.is_read
                ? theme.grey
                : getProjectColor(theme.type, log.recent_task.project_color)
            : null
    }

    const backgroundColor =
        log.username === selectedUser
            ? theme.social.activeBackgroundColor
            : theme.backgroundColor

    return (
        (isMobile || log.username !== me) && (
            <Frame
                onClick={handleSelect}
                $bgColor={backgroundColor}
                data-accept='true'>
                {isMobile && log.username === selectedUser ? (
                    <MobileLogDetail data-accept='true'>
                        <LogDetails
                            username={selectedUser}
                            selectedDate={selectedDate || tempSelectedDate}
                            pageType={pageType}
                        />
                    </MobileLogDetail>
                ) : (
                    <>
                        <SimpleProfile
                            user={log}
                            ringColor={setRingColor}
                            data-accept='true'
                        />
                        <RecentTask data-accept='true'>
                            {log.recent_task && (
                                <>
                                    <TaskName data-accept='true'>
                                        {' "' +
                                            putEllipsis(
                                                log.recent_task.name,
                                                32,
                                            ) +
                                            '" ' +
                                            t("log_preview_completed")}
                                    </TaskName>

                                    <Ago data-accept='true'>
                                        {" " +
                                            DateTime.fromISO(
                                                log.recent_task.completed_at,
                                            )
                                                .setLocale(locale)
                                                .toRelative() +
                                            " "}
                                    </Ago>
                                </>
                            )}
                        </RecentTask>
                    </>
                )}
            </Frame>
        )
    )
}

const Frame = styled.div`
    border-bottom: 0.05em solid ${(p) => p.theme.social.borderColor};
    background-color: ${(props) => props.$bgColor};

    padding: 1.2em 1em 1.2em;

    display: flex;
    align-items: center;
    gap: 1em;

    ${ifMobile} {
        background-color: ${(p) => p.theme.backgroundColor};
    }
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
