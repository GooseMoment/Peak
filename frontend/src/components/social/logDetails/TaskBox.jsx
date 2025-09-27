import styled from "styled-components"

import ReactionContainer from "@components/social/interaction/reactions/ReactionContainer"
import TaskFrame from "@components/tasks/TaskFrame"

const TaskBox = ({ task, color, isFollowingPage }) => {
    return (
        <TaskContainer>
            <TaskFrame task={task} color={color} isSocial />
            {isFollowingPage && <ReactionContainer task={task} />}
        </TaskContainer>
    )
}

const TaskContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export default TaskBox
