import { Link } from "react-router-dom"

import styled from "styled-components"

import TaskCircleFrame from "./TaskCircleFrame"

const TaskFrame = ({taskName, pathRoot=null, completed, color, isDate, editable, isLoading, toComplete}) => {

    const TextView = (
        <Text $completed={completed}>
            {taskName}
        </Text>
    )

    return (
        <>
            <TaskCircleFrame
                completed={completed}
                color={color}
                isDate={isDate}
                editable={editable}
                isLoading={isLoading}
                toComplete={toComplete}
            />
            {pathRoot ? <Link to={pathRoot} style={{ textDecoration: 'none' }}> 
                {TextView}
            </Link> : {TextView}}
        </>
    )
}

const Text = styled.div`
    width: 60em;
    font-style: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export default TaskFrame