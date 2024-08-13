import { useEffect, useState } from "react"

import styled from "styled-components"

import TaskCircle from "../tasks/TaskCircle"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskNameInput = ({
    task,
    setFunc,
    inputRef,
    newTaskName,
    setNewTaskName,
    color,
    isCreate,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })

    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        if (inputRef.current) {
            inputRef.current.focus()
          }
    }, [])

    useEffect(() => {
        setIsLoading(false)
    }, [task])

    const onChange = (e) => {
        const newName = e.target.value
        setNewTaskName(newName)
    }

    const changeTaskName = (name) => {
        setFunc({ name })
    }

    const onEnter = (e) => {
        if (isCreate)
            return
        if (e.key === "Enter") {
            changeTaskName(newTaskName)
            toast.success(t("name_change_success"))
        }
    }

    const toComplete = () => {
        setIsLoading(true)
        let completed_at = null
        if (!task.completed_at) {
            completed_at = new Date().toISOString()
        }
        setFunc({ completed_at })
    }

    return (
        <Box>
            <TaskCircle
                completed={task.completed_at}
                color={color}
                isLoading={isLoading}
                onClick={toComplete}
                isInput
            />
            <InputText
                $completed={task.completed_at}
                ref={inputRef}
                type="text"
                onChange={onChange}
                onKeyDown={onEnter}
                value={newTaskName || ""}
                placeholder={t("name_placeholder")}
            />
        </Box>
    )
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
    color: ${(p) => (p.$completed ? p.theme.grey : p.theme.textColor)};
    margin-top: 0.1em;
    line-height: 1.3em;
`

export default TaskNameInput
