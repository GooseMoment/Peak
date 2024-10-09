import { useEffect, useState } from "react"

import styled from "styled-components"

import TaskCircle from "@components/tasks/TaskCircle"

import { useTranslation } from "react-i18next"

const TaskNameInput = ({
    task,
    name,
    setName,
    inputRef,
    color,
    setFunc=()=>{},
    isCreating = false,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (inputRef?.current) {
            inputRef.current.focus()
        }
    }, [])

    useEffect(() => {
        setIsLoading(false)
    }, [task])

    const onChange = (e) => {
        const newName = e.target.value
        setName(newName)
    }

    const onEnter = (e) => {
        if (isCreating) {
            return
        }
        if (e.code === "Enter") {
            e.preventDefault()
            setName(e.target.value)
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
                onClick={isCreating ? null : toComplete}
                isInput
            />
            <InputText
                $completed={task.completed_at}
                ref={inputRef}
                type="text"
                onChange={onChange}
                onKeyDown={onEnter}
                value={name || ""}
                placeholder={t("name_placeholder")}
            />
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`

const InputText = styled.input`
    flex-grow: 1;
    font-size: 1.1em;
    color: ${(p) => (p.$completed ? p.theme.grey : p.theme.textColor)};
    margin-top: 0.1em;
    line-height: 1.3em;
`

export default TaskNameInput
