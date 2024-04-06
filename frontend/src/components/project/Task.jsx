import styled from "styled-components"

import TaskName from "./TaskName"
import Priority from "./Priority"

function Task({projectId, task, color}){
    const today = new Date()
    
    return (
        <Box>
            <Priority priority={task.priority} completed={task.completed_at ? true : false}/>
            <div>
                <TaskName projectId={projectId} task={task} color={color} editable={false}/>
                {task.due_date && <CalendarText $completed={task.completed_at ? true : false}>
                        {task.due_date === today.toISOString().slice(0, 10) && <CalendarTextPlus>오늘</CalendarTextPlus>}
                        {task.due_date === today.toISOString().slice(0, 10) && "| "}
                        {task.due_date}
                </CalendarText>}
            </div>
        </Box>
    );
}

const Box = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1em;

    & img {
        width: 1em;
        height: 1em;
        margin-top: 0.4em;
        margin-right: 0.2em;
    }
`

const CalendarText = styled.p`
    display: flex;
    margin-left: 2.75em;
    font-style: normal;
    font-size: 0.8em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
`

const CalendarTextPlus = styled.p`
    font-style: bold;
    font-size: 1em;
    color: #FF0000;
    padding-right: 0.5em;
`

export default Task