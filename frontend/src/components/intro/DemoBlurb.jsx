import styled from "styled-components"

import UserProfile from "@components/intro/UserProfile"
import TaskFrame from "@components/tasks/TaskFrame"

const DemoBlurb = ({ log }) => {
    return (
        <Box>
            <TopBox>
                <UserProfile
                    username={log.username}
                    profileImg={log.profile_img}
                    colors={log.colors}
                />
                <Blurb>{log.blurb}</Blurb>
            </TopBox>
            {log.tasks.map((task) => (
                <TaskFrame
                    key={task.id}
                    task={task}
                    color={log.colors[task.id]}
                />
            ))}
        </Box>
    )
}

const Box = styled.div`
    flex: 1 1 50%;

    box-sizing: border-box;
    padding: 1em;
`

const TopBox = styled.div`
    flex-grow: 1;
    flex-basis: 50%;

    display: flex;
    gap: 0.75em;
`

const Blurb = styled.div`
    flex-grow: 1;
    flex-basis: 50%;

    background-color: ${(p) => p.theme.thirdBackgroundColor};
    padding: 0.75em;
    border-radius: 16px;

    display: flex;
    justify-content: center;
    align-items: center;
`

export default DemoBlurb
