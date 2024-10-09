import { useRef, useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button from "@components/common/Button"
import TaskNameInput from "@components/tasks/TaskNameInput"
import ContentsMobile from "./ContentsMobile"

import { postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateMobile = ({ closeCreate }) => {
    const { t } = useTranslation(null, { keyPrefix: "project.create" })

    const inputRef = useRef(null)

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
            closeCreate()
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
        <TaskCreateMobileBox onKeyDown={onKeyDown}>
            <TaskNameInput
                task={newTask}
                setFunc={editNewTask}
                inputRef={inputRef}
                newTaskName={newTaskName}
                setNewTaskName={setNewTaskName}
                color={color}
                isCreate
            />
            <ContentsMobile newTask={newTask} editNewTask={editNewTask}/>
            <AddButton disabled={postMutation.isPending} onClick={makeTask}>
                {t("button_add")}
            </AddButton>
        </TaskCreateMobileBox>
    )
}

const TaskCreateMobileBox = styled.div`
    margin: 1em 1.2em;
`

const AddButton = styled(Button)`
    float: right;
    margin-right: 0.3em;
    margin-top: 1.2em;
`

export default TaskCreateMobile
