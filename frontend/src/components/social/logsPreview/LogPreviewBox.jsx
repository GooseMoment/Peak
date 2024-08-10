import styled, { useTheme } from "styled-components"

import { getProjectColor } from "@components/project/Creates/palettes"
import SimpleProfile from "@components/social/common/SimpleProfile"

import { DateTime } from "luxon"

const putEllipsis = (text, maxLength) => {
    return text.length > maxLength
        ? text.substring(0, maxLength - 3) + "..."
        : text
}

const LogPreviewBox = ({ log, selectedUser, setSelectedUser }) => {
    const theme = useTheme()

    if (!log) return null

    const handleSelect = () => {
        setSelectedUser(log.username === selectedUser ? null : log.username)
    }

    const setRingColor = () => {
        return log.recent_task
            ? log.recent_task.is_read
                ? "#A4A4A4"
                : getProjectColor(theme.type, log.recent_task.project_color)
            : null
    }

    return (
        <Frame
            onClick={handleSelect}
            $bgcolor={log.username === selectedUser ? "#ffd7c7" : "#FEFDFC"}>
            <SimpleProfile user={log} ringColor={setRingColor} />
            <RecentTask>
                {log.recent_task && (
                    <>
                        <TaskName>
                            {' "' +
                                putEllipsis(log.recent_task.name, 32) +
                                '" 완료! '}
                        </TaskName>
                        {/* TODO: set locale */}
                        <Ago>
                            {" " +
                                DateTime.fromISO(
                                    log.recent_task.completed_at,
                                ).toRelative({ locale: "ko" }) +
                                " "}
                        </Ago>
                    </>
                )}
            </RecentTask>
        </Frame>
    )
}

const Frame = styled.div`
    border-bottom: 0.05em solid black;
    background-color: ${(props) => props.$bgcolor};

    padding: 1.2em 1em 1.2em;

    display: flex;
    align-items: center;
    gap: 1em;
`

const RecentTask = styled.div`
    min-width: 40%;
    flex-grow: 1;
    
    padding-top: 0.7em;
    line-height: 1.3em;
`

const TaskName = styled.div`
    display: inline;
    font-size: 1.1em;
`

const Ago = styled.span`
    margin-left: 0.5em;

    display: inline;

    font-size: 0.9em;
    color: #a4a4a4;
    white-space: nowrap;
`

export default LogPreviewBox
