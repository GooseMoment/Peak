import {
    ChangeEvent,
    KeyboardEvent,
    RefObject,
    useEffect,
    useState,
} from "react"

import styled from "styled-components"

import TaskCircle from "@components/tasks/TaskCircle"

import { type MinimalTask, type Task } from "@api/tasks.api"

import { PaletteColorName } from "@assets/palettes"

import { useTranslation } from "react-i18next"

interface TaskNameInputProps {
    task: Partial<Task>
    name: string
    setName: (name: string) => void
    color: PaletteColorName
    inputRef: RefObject<HTMLInputElement>
    setFunc?: (diff: Partial<MinimalTask>) => void
    isCreating?: boolean
}

const TaskNameInput = ({
    task,
    name,
    setName,
    color,
    inputRef,
    setFunc,
    isCreating = false,
}: TaskNameInputProps) => {
    const { t } = useTranslation("translation", { keyPrefix: "task" })

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (inputRef?.current) {
            inputRef.current.focus()
        }
    }, [inputRef])

    useEffect(() => {
        setIsLoading(false)
    }, [task])

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setName(newName)
    }

    const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (isCreating) {
            return
        }
        if (e.code === "Enter") {
            e.preventDefault()
            setName(e.currentTarget.value)
        }
    }

    const toComplete = () => {
        if (setFunc === undefined) return

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
                color={color}
                isCompleted={task.completed_at != null}
                isInput
                isLoading={isLoading}
                onClick={isCreating ? undefined : toComplete}
            />
            <InputText
                $isCompleted={task.completed_at != null}
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

const InputText = styled.input<{ $isCompleted: boolean }>`
    flex-grow: 1;
    font-size: 1.1em;
    color: ${(p) => (p.$isCompleted ? p.theme.grey : p.theme.textColor)};
    margin-top: 0.1em;
    line-height: 1.3em;
`

export default TaskNameInput
