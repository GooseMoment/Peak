import { useState } from "react"

import TaskCircle from "./TaskCircle"
import notify from "@utils/notify"

import styled from "styled-components"

const TaskNameInput = ({task, setFunc, newTaskName, setNewTaskName, color}) => {    
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e) => {
        const newName = e.target.value
        setNewTaskName(newName)
    }

    const changeTaskName = async (name) => {
        setFunc({name})
    }

    const onEnter = async (e) => {
        if(e.key === 'Enter') {
            changeTaskName(newTaskName)
            notify.success("이름이 변경되었습니다.")
        }
    }

    const toComplete = () => {
        setIsLoading(true)
        let completed_at = null
        if (!(task.completed_at)) {
            completed_at = new Date().toISOString()
        }
        setFunc({completed_at})
    }

    return <Box>
        <TaskCircle
            completed={task.completed}
            color={color}
            isLoading={isLoading}
            onClick={toComplete}
            isInput
        />
        <InputText
            $completed={task.completed}
            type='text'
            onChange={onChange}
            onKeyDown={onEnter}
            value={newTaskName}
            placeholder="할 일의 이름을 입력해주세요."
        />
    </Box>  
}

const Box = styled.div`
    display: flex;
    align-items: center;

    margin-top: 0.8em;
`

const InputText = styled.input`
    width: 36em;
    height: auto;
    font-weight: normal;
    font-size: 1.1em;
    color: ${p => p.$completed ? p.theme.grey : p.theme.textColor};
    margin-top: 0.1em;
    line-height: 1.3em;
`

export default TaskNameInput
