import styled from "styled-components"

import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

import { getCurrentUsername } from "@api/client"

const compareDailyLogs = (a, b) => {
    // Show self log first
    const me = getCurrentUsername()
    if (a.username === me) return -1
    else if (b.username === me) return 1

    if (!a.recent_task === !b.recent_task) {
        // (when there is no completed task) Show the user with the earliest username in alphabetical order first
        if (!a.recent_task) return a.username > b.username ? 1 : -1
        if (a.recent_task.is_read !== b.recent_task.is_read)
            return a.recent_task.is_read - b.recent_task.is_read
        return a.recent_task.is_read
            ? // Show the earliest completed tasks first
              new Date(a.recent_task.completed_at) -
                  new Date(b.recent_task.completed_at)
            : // Show more recently completed tasks first when not read yet
              new Date(b.recent_task.completed_at) -
                  new Date(a.recent_task.completed_at)
    }
    // Show user with recent work first
    return !a.recent_task - !b.recent_task
}

const LogsPreview = ({ logs, selectedUser, setSelectedUser, selectedDate }) => {    
    return (
        <LogsPreviewContainer>
            {logs.sort(compareDailyLogs).map((log) => (
                <LogPreviewBox
                    key={log.username}
                    log={log}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    selectedDate={selectedDate}
                />
            ))}
        </LogsPreviewContainer>
    )
}

const LogsPreviewContainer = styled.div`
    min-width: 20rem;
    max-width: 25rem;
    width: 80%;
    margin: 0 auto;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 1.2em;
`

export default LogsPreview
