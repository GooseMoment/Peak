import styled from "styled-components"

import UserProfile from "@components/intro/UserProfile"

import { TaskList } from "../drawers/Drawer"
import TaskFrame from "../tasks/TaskFrame"

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
            <TaskList>
                {log.tasks.map((task) => (
                    <TaskFrame
                        key={task.id}
                        task={task}
                        color={log.colors[task.id]}
                    />
                ))}
            </TaskList>
        </Box>
    )
}

const Box = styled.div`
    flex-grow: 1;
    flex-basis: 50%;

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

    min-width: 5em;

    background-color: ${(p) => p.theme.thirdBackgroundColor};
    padding: 1em;
    border-radius: 16px;

    display: flex;
    justify-content: center;
    align-items: center;
`

export default DemoBlurb
