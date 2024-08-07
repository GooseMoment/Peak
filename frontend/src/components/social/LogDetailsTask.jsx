import styled from "styled-components"

import ReactionBox from "@components/social/ReactionBox"
import TaskFrame from "@components/tasks/TaskFrame"

const LogDetailsTask = ({task, color}) => {
    return <TaskContainer>
        <TaskFrame task={task} color={color}/>
        <ReactionBox parentType={'task'} parent={task} />
    </TaskContainer>
}

const TaskContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export default LogDetailsTask