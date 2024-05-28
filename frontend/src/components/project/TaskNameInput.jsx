import styled from "styled-components"

import TaskCircleFrame from "./TaskCircleFrame"
import notify from "@utils/notify"

const TaskNameInput = ({newTaskName, setNewTaskName, changeTaskName, completed, color, isDate, editable, isLoading, toComplete}) => {    
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

    const EditView = (
        <InputText
            $completed={completed}
            type='text'
            onChange={onChange}
            onKeyDown={onEnter}
            value={newTaskName}
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
    height: auto;
    font-weight: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
    margin-top: 0.1em;
    line-height: 1.3em;
`

export default TaskNameInput