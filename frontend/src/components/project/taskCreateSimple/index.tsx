import {
    MouseEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"

import { useMutation } from "@tanstack/react-query"
import styled, { css, useTheme } from "styled-components"

import SimpleAssigned from "@components/project/taskCreateSimple/SimpleAssigned"
import SimpleDue from "@components/project/taskCreateSimple/SimpleDue"
import SimplePriority from "@components/project/taskCreateSimple/SimplePriority"
import TaskNameInput from "@components/tasks/TaskNameInput"
import createInitialTask from "@components/tasks/utils/createInitialTask"

import { type Drawer } from "@api/drawers.api"
import { type MinimalTask, postTask } from "@api/tasks.api"

import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getPaletteColor } from "@assets/palettes"
import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

type SimpleContentKey = "name" | "assigned" | "due" | "priority"

const TaskCreateSimple = ({
    drawer,
    onClose,
}: {
    drawer: Drawer
    onClose: () => void
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "task.edit" })
    const inputRef = useRef<HTMLInputElement>(null)

    const [newTask, setNewTask] = useState<MinimalTask>(() =>
        createInitialTask(drawer),
    )

    const theme = useTheme()

    const color = getPaletteColor(theme.type, drawer.project.color)

    const [content, setContent] = useState<SimpleContentKey>("name")
    const [assignedIndex, setAssignedIndex] = useState<number>(0)
    const [dueIndex, setDueIndex] = useState<number>(0)
    const [priorityIndex, setPriorityIndex] = useState<number>(0)

    const editNewTask = useCallback(
        (diff: Partial<MinimalTask>) => {
            setNewTask(Object.assign({}, newTask, diff))
        },
        [newTask],
    )

    const items = useMemo(
        () => [
            {
                name: "name" as const,
                icon: <FeatherIcon icon="tag" />,
                component: (
                    <TaskNameInput
                        task={newTask}
                        name={newTask.name || ""}
                        setName={(name) => editNewTask({ name })}
                        color={drawer.project.color}
                        inputRef={inputRef}
                        setFunc={editNewTask}
                        isCreating
                    />
                ),
            },
            {
                name: "assigned" as const,
                icon: <FeatherIcon icon="calendar" />,
                component: (
                    <SimpleAssigned
                        assignedIndex={assignedIndex}
                        setAssignedIndex={setAssignedIndex}
                        editNewTask={editNewTask}
                        color={color}
                    />
                ),
            },
            {
                name: "due" as const,
                icon: <Hourglass />,
                component: (
                    <SimpleDue
                        dueIndex={dueIndex}
                        setDueIndex={setDueIndex}
                        editNewTask={editNewTask}
                        color={color}
                    />
                ),
            },
            {
                name: "priority" as const,
                icon: <FeatherIcon icon="alert-circle" />,
                component: (
                    <SimplePriority
                        priorityIndex={priorityIndex}
                        setPriorityIndex={setPriorityIndex}
                        editNewTask={editNewTask}
                        color={color}
                    />
                ),
            },
        ],
        [
            newTask,
            drawer.project.color,
            editNewTask,
            assignedIndex,
            color,
            dueIndex,
            priorityIndex,
        ],
    )

    const onKeyDownAlt = useCallback(
        (e: KeyboardEvent) => {
            if (!e.altKey) {
                return
            }

            const selectedNumber = Number(e.code.slice(5))
            if (selectedNumber && selectedNumber <= items.length) {
                e.preventDefault()
                setContent(items[selectedNumber - 1].name)
            }
        },
        [items],
    )

    useEffect(() => {
        document.addEventListener("keydown", onKeyDownAlt)

        return () => {
            document.removeEventListener("keydown", onKeyDownAlt)
        }
    }, [onKeyDownAlt])

    const handleClickContent = (e: MouseEvent<HTMLDivElement>) => {
        const name = e.currentTarget.getAttribute("name")
        setContent(name as SimpleContentKey)
    }

    const postMutation = useMutation({
        mutationFn: (data: MinimalTask) => {
            const taskData = {
                ...data,
                drawer: data.drawer.id,
            }
            return postTask(taskData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: drawer.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: drawer.project.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", drawer.project.id],
            })
            toast.success(t("create_success"))
            onClose()
        },
        onError: () => {
            toast.error(t("create_error"))
        },
    })

    const onKeyDownEnter = (e: KeyboardEvent | React.KeyboardEvent) => {
        if (postMutation.isPending) {
            e.preventDefault()
            return
        }

        if (e.code !== "Enter") {
            return
        }

        e.preventDefault()

        if (newTask.name === undefined || newTask.name.trim() === "") {
            toast.error(t("create_no_name"))
            inputRef.current?.focus()
            return
        }

        postMutation.mutate(newTask)
    }

    return (
        <TaskCreateSimpleBlock onKeyDown={onKeyDownEnter}>
            <IndexBlock>
                {items.map((item) => (
                    <IndexBox
                        key={item.name}
                        data-name={item.name}
                        onClick={handleClickContent}
                        $color={color}
                        $isSelected={content === item.name}>
                        {item.icon}
                    </IndexBox>
                ))}
            </IndexBlock>
            <TaskCreateSimpleBox>
                {items.map((item) =>
                    content === item.name ? (
                        <ComponentBox
                            key={item.name}
                            $isSelected={content === item.name}>
                            {item.component}
                        </ComponentBox>
                    ) : null,
                )}
            </TaskCreateSimpleBox>
        </TaskCreateSimpleBlock>
    )
}

const TaskCreateSimpleBlock = styled.div`
    margin: 0.5em 0em;
`

const IndexBlock = styled.div`
    z-index: 1;
    position: relative;
    top: 3px;
    display: flex;
    gap: 0.3em;
    margin-left: 2.5em;

    ${ifMobile} {
        margin-left: 1.5em;
    }
`

const TaskCreateSimpleBox = styled.div`
    z-index: 2;
    position: relative;
    display: flex;
    align-items: center;
    width: 95%;
    height: 3.8em;
    margin-left: 1.7em;
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1.5px ${(p) => p.theme.grey};
    border-radius: 15px;
    overflow-y: hidden;
    overflow-x: auto;

    ${ifMobile} {
        margin-left: 0.8em;
    }
`

const IndexBox = styled.div<{ $isSelected: boolean; $color: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.2em;
    height: 2.2em;
    border: 1px solid ${(p) => p.theme.grey};
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    cursor: pointer;

    & svg {
        width: 19px;
        height: 19px;
        top: 0;
        margin-right: 0;
        stroke: ${(p) => p.theme.textColor};
    }

    ${({ $isSelected }) =>
        $isSelected &&
        css<{ $color: string }>`
            background-color: ${({ $color }) => $color};

            & svg {
                stroke: ${({ theme }) => theme.white};
            }
        `}
`

const ComponentBox = styled.div<{ $isSelected: boolean }>`
    width: 100%;

    ${(props) =>
        props.$isSelected &&
        css`
            padding: 0em 1em;
        `}
`

export default TaskCreateSimple
