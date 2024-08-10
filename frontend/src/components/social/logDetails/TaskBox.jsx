import styled from "styled-components"

import InteractionBox from "@components/social/interaction/InteractionBox"
import TaskFrame from "@components/tasks/TaskFrame"

const TaskBox = ({ task, color, isFollowing }) => {
    return (
        <TaskContainer>
            <TaskFrame task={task} color={color} />
            { isFollowing && <InteractionBox parentType={"task"} parent={task} />}
        </TaskContainer>
    )
}

const TaskContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export default TaskBox