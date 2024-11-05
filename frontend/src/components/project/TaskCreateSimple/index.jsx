import { useEffect, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import styled, { css } from "styled-components"

import SimpleAssigned from "@components/project/TaskCreateSimple/SimpleAssigned"
import SimpleDue from "@components/project/TaskCreateSimple/SimpleDue"
import SimplePriority from "@components/project/TaskCreateSimple/SimplePriority"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import Hourglass from "@assets/project/Hourglass"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateSimple = ({
    projectID,
    projectName,
    drawerID,
    drawerName,
    color,
    onClose,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const inputRef = useRef(null)

    const [content, setContent] = useState("name")
    const [assignedIndex, setAssignedIndex] = useState(0)
    const [dueIndex, setDueIndex] = useState(0)
    const [priorityIndex, setPriorityIndex] = useState(0)

    const onKeyDownAlt = (e) => {
        if (!e.altKey) {
            return
        }

        const selectedNumber = Number(e.code.slice(5))
        if (selectedNumber && selectedNumber <= items.length) {
            e.preventDefault()
            setContent(items[selectedNumber - 1].name)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDownAlt)

        return () => {
            document.removeEventListener("keydown", onKeyDownAlt)
        }
    }, [])

    const handleClickContent = (e) => {
        const name = e.currentTarget.getAttribute("name")
        setContent(name)
    }

    const [newTask, setNewTask] = useState({
        name: "",
        assigned_at: null,
        due_type: null,
        due_date: null,
        due_datetime: null,
        priority: 0,
        reminders: [],
        drawer: drawerID,
        drawer_name: drawerName,
        project_id: projectID,
        project_name: projectName,
        memo: "",
        privacy: "public",
    })

    const editNewTask = (edit) => {
        setNewTask(Object.assign({}, newTask, edit))
    }

    const postMutation = useMutation({
        mutationFn: (data) => {
            return postTask(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: newTask.drawer }],
            })
            queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: newTask.project_id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["project", newTask.project_id],
            })
            toast.success(t("task_create_success"))
            onClose()
        },
        onError: () => {
            toast.error(t("task_create_error"))
        },
    })

    const onKeyDownEnter = (e) => {
        if (postMutation.isPending) {
            e.preventDefault()
            return
        }

        if (e.code !== "Enter") {
            return
        }

        e.preventDefault()

        if (newTask.name.trim() === "") {
            return toast.error(t("task_create_no_name"))
        }

        postMutation.mutate(newTask)
    }

    const items = [
        {
            name: "name",
            icon: <FeatherIcon icon="tag" />,
            component: (
                <TaskNameInput
                    task={newTask}
                    name={newTask.name}
                    setName={(name) => editNewTask({ name })}
                    inputRef={inputRef}
                    color={color}
                    setFunc={editNewTask}
                    isCreate
                />
            ),
        },
        {
            name: "assigned",
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
            name: "due",
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
            name: "priority",
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
    ]

    return (
        <TaskCreateSimpleBlock onKeyDown={onKeyDownEnter}>
            <IndexBlock>
                {items.map((item) => (
                    <IndexBox
                        key={item.name}
                        name={item.name}
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
    margin: 1em 0em;
`

const IndexBlock = styled.div`
    z-index: 1;
    position: relative;
    top: 3px;
    display: flex;
    gap: 0.3em;
    margin-left: 2.5em;
`

const TaskCreateSimpleBox = styled.div`
    z-index: 2;
    position: relative;
    display: flex;
    align-items: center;
    width: 94%;
    height: 3.8em;
    margin-left: 1.7em;
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1.5px ${(p) => p.theme.grey};
    border-radius: 15px;
    overflow-y: hidden;
    overflow-x: auto;
`

const IndexBox = styled.div`
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

    ${(props) =>
        props.$isSelected &&
        css`
            background-color: ${(props) => props.$color};

            & svg {
                stroke: ${(p) => p.theme.white};
            }
        `}
`

const ComponentBox = styled.div`
    width: 100%;

    ${(props) =>
        props.$isSelected &&
        css`
            padding: 0em 1.1em;
        `}
`

export default TaskCreateSimple
