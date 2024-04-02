import { Link } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import { completeTask, uncompleteTask } from "@/api/tasks.api"

function TaskName({projectId, task, setTasks, color, due_date, isModalOpen, openModal}){
    const date = new Date()
    const pathRoot = `/app/projects/${projectId}/tasks/${task.id}/detail`

    const [text, setText] = useState(task.name)
    
    const onchange = (e) => {
        setText(e.target.value)
        console.log(text)
    }

    const toComplete = (id) => {
        return async () => {
            let completed_at = null
            if (task.completed_at) {
                await uncompleteTask(id)
            }
            else {
                await completeTask(id)
                completed_at = date.toISOString()
            }
            setTasks(prev => prev.map(task => {
                if (task.id === id) {
                    task.completed_at = completed_at
                }
                return task
            }))
        }
    }

    const EditView = (
        <InputText 
            $completed={task.completed_at ? true : false} 
            onClick={openModal}
            type='text'
            onChange={onchange}
            value={text}
            placeholder="할 일의 이름을 입력해주세요."
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
                    onClick={toComplete(task.id)}
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
    display: flex;
    justify-content: center;
    top: ${(props) => (props.$due_date ? 0.3 : 0)}em;
    width: 1.2em;
    height: 1.2em;
    border-radius: 50%;
    border: 3px solid ${(props) => (props.$completed ? '#A4A4A4': `#${props.$color}`)};
    position: relative;
    margin-right: 0.6em;
    font-size: 1em;

    & svg {
    width: 1em;
    height: 1em;
    stroke: #A4A4A4;
    stroke-width: 0.2em;
    margin-right: 0;
}
`

const Text = styled.div`
    font-style: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
`

const InputText = styled.input`
    font-weight: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
    border: none;
    margin-top: 0.1em;

    &:focus {
        outline: none;
    }
`

export default TaskName