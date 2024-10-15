import { useEffect, useRef, useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import ModalBottomSheet, { Header } from "@components/common/ModalBottomSheet"
import ContentsMobile from "@components/project/taskDetails/mobile/ContentsMobile"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { postTask } from "@api/tasks.api"

import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateMobile = ({ closeCreate }) => {
    const { t: tProject } = useTranslation(null, {
        keyPrefix: "project.create",
    })
    const { t: tTask } = useTranslation(null, { keyPrefix: "task" })

    const inputRef = useRef(null)

    const [_, color] = useOutletContext()
    const { state } = useLocation()
    const { isDesktop } = useScreenType()

    const [title, setTitle] = useState(null)
    const [newTaskName, setNewTaskName] = useState(null)
    const [activeContent, setActiveContent] = useState(null)

    useEffect(() => {
        if (activeContent === null) {
            setTitle(tTask("create"))
        } else if (activeContent) {
            setTitle(tTask(activeContent.name + ".title"))
        }
    }, [activeContent])

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

    const handleChange = (diff) => {
        setNewTask(Object.assign({}, newTask, diff))

        if (isDesktop) {
            inputRef.current.focus()
        }
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
            toast.success(tProject("task_create_success"))
            closeCreate()
        },
        onError: () => {
            if (newTask.name) toast.error(tProject("task_create_error"))
            else toast.error(tProject("task_create_no_name"))
        },
    })

    const makeTask = () => {
        postMutation.mutate(newTask)
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            makeTask()
        }
    }

    return (
        <ModalBottomSheet
            onClose={closeCreate}
            headerContent={
                <Header
                    title={title}
                    closeSheet={closeCreate}
                    handleBack={
                        activeContent ? () => setActiveContent(null) : null
                    }
                />
            }>
            <TaskCreateMobileBox onKeyDown={onKeyDown}>
                <TaskNameInput
                    task={newTask}
                    setFunc={handleChange}
                    inputRef={inputRef}
                    newTaskName={newTaskName}
                    setNewTaskName={setNewTaskName}
                    color={color}
                    isCreate
                />
                <ContentsMobile
                    newTask={newTask}
                    editNewTask={handleChange}
                    activeContent={activeContent}
                    setActiveContent={setActiveContent}
                />
                {activeContent?.component}
                {!activeContent && (
                    <ButtonGroup
                        $justifyContent="flex-end"
                        $margin="1em 0em 1em">
                        <Button
                            disabled={postMutation.isPending}
                            loading={postMutation.isPending}
                            onClick={makeTask}>
                            {tProject("button_add")}
                        </Button>
                    </ButtonGroup>
                )}
            </TaskCreateMobileBox>
        </ModalBottomSheet>
    )
}

const TaskCreateMobileBox = styled.div`
    margin: 1em 1.2em;
`

export default TaskCreateMobile
