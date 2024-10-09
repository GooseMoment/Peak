import { useState, useEffect } from "react"
import { useOutletContext, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

import TaskCommonDetail from "./TaskCommonDetail"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import SkeletonTaskDetail from "@components/project/skeletons/SkeletonTaskDetail"

import { getTask } from "@api/tasks.api"

import { useTranslation } from "react-i18next"

const TaskDetail = () => {
    const { t } = useTranslation(null, { keyPrefix: "project" })

    const [projectID, color] = useOutletContext()
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

    const [newTask, setNewTask] = useState(task)

    useEffect(() => {
        if (task && task.reminders?.length !== 0) {
            const deltaArray = task.reminders.map(reminder => reminder.delta)
            setNewTask(Object.assign({}, task, { reminders: deltaArray }))
        } else {
            setNewTask(task)
        }
    }, [task])

    if (isLoading) {
        return (
            <TaskDetailBox>
                <SkeletonTaskDetail />
            </TaskDetailBox>
        )
    }

    if (isError) {
        return (
            <TaskDetailBox>
                <ErrorBox onClick={refetch}>{t("error_load_task")}</ErrorBox>
            </TaskDetailBox>
        )
    }

    return (
        <TaskCommonDetail
            task={task}
            newTask={newTask}
            setNewTask={setNewTask}
            projectID={projectID}
            color={color}
        />
    )
}

const TaskDetailBox = styled.div`
    width: 50em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;

    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

export default TaskDetail
