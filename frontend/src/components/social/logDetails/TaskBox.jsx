import styled from "styled-components"

import InteractionContainer from "@components/social/interaction/InteractionContainer"
import TaskFrame from "@components/tasks/TaskFrame"

const TaskBox = ({ task, color, isFollowingPage }) => {
    return (
        <TaskContainer>
            <TaskFrame task={task} color={color} isSocial />
            {isFollowingPage && <InteractionContainer task={task} />}
        </TaskContainer>
    )
}

const TaskContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export default TaskBox
