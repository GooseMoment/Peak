import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import TaskCircle from "../tasks/TaskCircle"
import notify from "@utils/notify"

import styled from "styled-components"

const TaskNameInput = ({task, setFunc, newTaskName, setNewTaskName, color}) => {  
    const { t } = useTranslation(null, {keyPrefix: "task"})

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(false)
    }, [task])

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
            notify.success(t("name_change_success"))
        }
    }

    const toComplete = () => {
        setIsLoading(true)
        let completed_at = null
        if (!task.completed_at) {
            completed_at = new Date().toISOString()
        }
        setFunc({completed_at})
    }

    return <Box>
        <TaskCircle
            completed={task.completed_at}
            color={color}
            isLoading={isLoading}
            onClick={toComplete}
            isInput
        />
        <InputText
            $completed={task.completed_at}
            type='text'
            onChange={onChange}
            onKeyDown={onEnter}
            value={newTaskName || ''}
            placeholder={t("name_placeholder")}
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
