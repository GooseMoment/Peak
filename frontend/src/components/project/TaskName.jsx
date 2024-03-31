import { Link } from "react-router-dom";
import { useState } from "react";

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

function TaskName({projectId, task, color, due_date, isModalOpen, openModal}){
    const date = new Date()
    const pathRoot = `/app/projects/${projectId}/tasks/${task.id}/detail`

    const [text, setText] = useState(task.name)
    
    const onchange = (e) => {
        setText(e.target.value)
        console.log(text)
    }

    const EditView = (
        <InputText 
            $completed={task.completed_at ? true : false} 
            onClick={openModal}
            type='text'
            onChange={onchange}
            value={text}
        />
    )

    const TextView = (
        <Text $completed={task.completed_at ? true : false} onClick={openModal}>
            {task.name}
        </Text>
    )

    return (
        <>
            <TaskNameBox>
                <TaskCircle
                    $completed={task.completed_at ? true : false}
                    $color={color}
                    $due_date={due_date}
                >
                    {task.completed_at && <FeatherIcon icon="check"/>}
                </TaskCircle>
                { isModalOpen ? EditView :
                <Link to={pathRoot} style={{ textDecoration: 'none' }}> 
                    {TextView}
                </Link>}

            </TaskNameBox>
        </>
    );
}

const TaskNameBox = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    padding-top: 0.8em;

    &:hover {
        cursor: pointer;
    }
`

const TaskCircle = styled.div`
    top: ${(props) => (props.$due_date ? 0.3 : 0)}em;
    width: 1.2em;
    height: 1.2em;
    border-radius: 50%;
    border: 3px solid ${(props) => (props.$completed ? '#A4A4A4': `#${props.$color}`)};
    position: relative;
    margin-right: 0.6em;
    font-size: 1em;

    & svg {
    width: inherit;
    height: inherit;
    stroke: #A4A4A4;
}
`

const Text = styled.div`
    font-style: normal;
    font-size: 1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
`

const InputText = styled.input`
    font-weight: normal;
    font-size: 1em;
    color: '#000000';
    border: none;
    margin-top: 0.1em;

    &:focus {
        outline: none;
    }
`

export default TaskName