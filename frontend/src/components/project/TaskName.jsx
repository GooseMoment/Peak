import { Link } from "react-router-dom"

import styled from "styled-components"

import TaskCircle from "./TaskCircle"

const TaskName = ({taskName, taskDetailPath=null, completed, color, isDate, editable, isLoading, toComplete}) => {
    const TextView = (
        <Text $completed={completed}>
            {taskName}
        </Text>
    )

    return (
        <>
            <TaskCircle
                completed={completed}
                color={color}
                isDate={isDate}
                editable={editable}
                isLoading={isLoading}
                toComplete={toComplete}
            />
            {taskDetailPath ? <Link to={taskDetailPath} style={{ textDecoration: 'none' }}> 
                {TextView}
            </Link> : TextView}
        </>
    )
}

const Text = styled.div`
    width: 60em;
    font-style: normal;
    font-size: 1.1em;
    color: ${p => p.$completed ? p.theme.grey : p.theme.textColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3em;
`

export default TaskName
