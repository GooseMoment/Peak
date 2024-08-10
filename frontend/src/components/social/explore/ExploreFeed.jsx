import styled from "styled-components"

import LogPreviewBox from "@components/social/logsPreview/LogPreviewBox"

const ExploreFeed = ({
    recommendUsers,
    foundUsers,
    selectedUser,
    setSelectedUser,
}) => {
    return (
        <DailyLogsPreviewContainer>
            {foundUsers && Object.values(foundUsers).length
                ? Object.values(foundUsers).map((dailyFollowerLog) => (
                      <LogPreviewBox
                          key={dailyFollowerLog.username}
                          log={dailyFollowerLog}
                          selectedUser={selectedUser}
                          setSelectedUser={setSelectedUser}
                      />
                  ))
                : Object.values(recommendUsers).map((dailyFollowerLog) => (
                      <LogPreviewBox
                          key={dailyFollowerLog.username}
                          log={dailyFollowerLog}
                          selectedUser={selectedUser}
                          setSelectedUser={setSelectedUser}
                      />
                  ))}
        </DailyLogsPreviewContainer>
    )
}

const DailyLogsPreviewContainer = styled.div``

export default ExploreFeed
