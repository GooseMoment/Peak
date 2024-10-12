import { useRef, useState, useEffect } from "react"
import { useOutletContext, useParams } from "react-router-dom"

import { useMutation } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import ModalBottomSheet, { Header } from "@components/common/ModalBottomSheet"
import ContentsMobile from "@components/project/taskDetails/mobile/ContentsMobile"
import TaskNameInput from "@components/tasks/TaskNameInput"

import { getTask, patchTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"

const TaskDetailMobile = ({ closeDetail }) => {
    const { t } = useTranslation(null, { keyPrefix: "task" })

    const inputRef = useRef(null)

    const [_, color] = useOutletContext()
    const { task_id } = useParams()

    const {
        data: task,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["task", { taskID: task_id }],
        queryFn: () => getTask(task_id),
    })

    const [title, setTitle] = useState(null)
    const [taskName, setTaskName] = useState(task?.name)
    const [activeContent, setActiveContent] = useState(null)

    useEffect(()=>{
        setTaskName(task?.name)
    }, [task])

    useEffect(() => {
        if (activeContent === null) {
            setTitle(t("edit"))
        } else if (activeContent) {
            setTitle(t(activeContent.name + ".title"))
        }
    }, [activeContent])

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchTask(task_id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task_id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer }],
            })
            inputRef.current.focus()
        },
    })

    if (isLoading) {
        return null
    }

    return (
        <ModalBottomSheet
            onClose={closeDetail} 
            headerContent={<Header title={title} closeSheet={closeDetail} handleBack={activeContent ? ()=>setActiveContent(null) : null}/>}>
            <TaskDetailMobileBox>
                <TaskNameInput
                    task={task}
                    setFunc={patchMutation.mutate}
                    inputRef={inputRef}
                    newTaskName={taskName}
                    setNewTaskName={setTaskName}
                    color={color}
                    isCreate
                />
                <ContentsMobile newTask={task} editNewTask={patchMutation.mutate} activeContent={activeContent} setActiveContent={setActiveContent}/>
                {activeContent?.component}
            </TaskDetailMobileBox>
        </ModalBottomSheet>
    )
}

const TaskDetailMobileBox = styled.div`
    margin: 1em 1.2em;
`

export default TaskDetailMobile
