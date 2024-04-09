import { useSubmit } from "react-router-dom"
import { useState } from "react"

import styled from "styled-components"

import TaskCircleFrame from "./TaskCircleFrame"
import notify from "@utils/notify"

const TaskNameInput = ({taskName, completed, color, isDate, editable, isLoading, toComplete}) => {
    const [newTaskName, setNewTaskName] = useState(taskName)
    const submit = useSubmit()

    const onChange = (e) => {
        setNewTaskName(e.target.value)
    }
    
    const changeTaskName = async (name) => {
        submit({name}, {method: "PATCH"})
    }

    const onEnter = async (e) => {
        if(e.key === 'Enter') {
            changeTaskName(newTaskName)
            notify.success("이름이 변경되었습니다.")
        }
    }

    const EditView = (
        <InputText
            $completed={completed}
            type='text'
            onChange={onChange}
            value={newTaskName}
            onKeyDown={onEnter}
            placeholder="할 일의 이름을 입력해주세요."
        />
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
            {EditView}
        </>  
    )
}

const InputText = styled.input`
    width: 36em;
    font-weight: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
    border: none;
    margin-top: 0.1em;

    &:focus {
        outline: none;
    }
`

export default TaskNameInput