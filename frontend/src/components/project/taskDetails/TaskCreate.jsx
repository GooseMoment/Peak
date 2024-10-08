import { useRef, useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button from "@components/common/Button"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import TaskNameInput from "@components/tasks/TaskNameInput"

import Contents from "./Contents"

import { postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreate = () => {
    const { t } = useTranslation(null, { keyPrefix: "project.create" })
    const inputRef = useRef(null)

    const { closeModal } = useModalWindowCloseContext()

    const [_, color] = useOutletContext()
    const { state } = useLocation()

    const [newTaskName, setNewTaskName] = useState(null)

    const [newTask, setNewTask] = useState({
        name: newTaskName,
        assigned_at: null,
        due_type: null,
        due_date: null,
        due_datetime: null,
        reminders: [],
        priority: 0,
        project_id: state?.project_id,
        project_name: state?.project_name,
        drawer: state?.drawer_id,
        drawer_name: state?.drawer_name,
        memo: "",
        privacy: "public",
    })

    const editNewTask = (edit) => {
        setNewTask(Object.assign(newTask, edit))
        inputRef.current.focus()
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
                queryKey: ["projects", newTask.project_id],
            })
            toast.success(t("task_create_success"))
            closeModal()
        },
        onError: () => {
            if (newTask.name) toast.error(t("task_create_error"))
            else toast.error(t("task_create_no_name"))
        },
    })

    const makeTask = () => {
        editNewTask({ name: newTaskName })
        postMutation.mutate(newTask)
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            makeTask()
        }
    }

    return (
        <TaskCreateBox onKeyDown={onKeyDown}>
            <TaskNameBox>
                <TaskNameInput
                    task={newTask}
                    setFunc={editNewTask}
                    inputRef={inputRef}
                    newTaskName={newTaskName}
                    setNewTaskName={setNewTaskName}
                    color={color}
                    isCreate
                />
                <Icons>
                    <FeatherIcon icon="x" onClick={closeModal} />
                </Icons>
            </TaskNameBox>
            <Contents task={newTask} setFunc={editNewTask} />
            <AddButton disabled={postMutation.isPending} onClick={makeTask}>
                {t("button_add")}
            </AddButton>
        </TaskCreateBox>
    )
}

const TaskCreateBox = styled.div`
    width: 50em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.secondBackgroundColor};
    border-radius: 15px;

    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

const TaskNameBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1.6em 1.8em 1em;
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        top: 0.15em;
        cursor: pointer;
        stroke: ${(p) => p.theme.goose};
        margin-left: 1em;
    }
`

const AddButton = styled(Button)`
    float: right;
    margin: 1em;
    margin-right: 2.5em;
    margin-bottom: 1.5em;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`

export default TaskCreate
