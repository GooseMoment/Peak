import styled from "styled-components"

import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

const compareDailyLogs = (a, b) => {
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

const LogsPreview = ({ logs, selectedUser, setSelectedUser }) => {
    return (
        <LogsPreviewContainer>
            {logs.sort(compareDailyLogs).map((log, index) => (
                <LogPreviewBox
                    key={index}
                    log={log}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            ))}
        </LogsPreviewContainer>
    )
}

const LogsPreviewContainer = styled.div``

export default LogsPreview