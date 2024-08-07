import styled from "styled-components"
import DailyLogPreview from "@components/social/DailyLogPreview"

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

const LogsPreview = ({logs, selectedUser, setSelectedUser}) => {
    return (
        <LogsPreviewContainer>
            {logs.sort(compareDailyLogs)
                .map((dailyFollowerLog, index) => (
                    <DailyLogPreview
                        key={index}
                        dailyLog={dailyFollowerLog}
                        selectedUsername={selectedUser}
                        setSelectedUsername={setSelectedUser}
                    />
                ))}
        </LogsPreviewContainer>
    )
}

const LogsPreviewContainer = styled.div`
    
`

export default LogsPreview