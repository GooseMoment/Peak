import TaskCircle from "./TaskCircle"
import notify from "@utils/notify"

import styled from "styled-components"

const TaskNameInput = ({newTaskName, setNewTaskName, changeTaskName, completed, color, isLoading, toComplete}) => {    
    const onChange = (e) => {
        const newName = e.target.value
        setNewTaskName(newName)
    }

    const onEnter = async (e) => {
        if(e.key === 'Enter') {
            changeTaskName(newTaskName)
            notify.success("이름이 변경되었습니다.")
        }
    }

    return <>
        <TaskCircle
            completed={completed}
            color={color}
            isLoading={isLoading}
            onClick={toComplete}
            isInput
        />
        <InputText
            $completed={completed}
            type='text'
            onChange={onChange}
            onKeyDown={onEnter}
            value={newTaskName}
            placeholder="할 일의 이름을 입력해주세요."
        />
    </>  
}

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
