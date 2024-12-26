import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"

import { ErrorBox } from "@components/errors/ErrorProjectPage"
import SkeletonTaskDetail from "@components/project/skeletons/SkeletonTaskDetail"

import TaskCommonDetail, { TaskDetailBox } from "@components/project/taskDetails/TaskCommonDetail"

import { getTask } from "@api/tasks.api"

import { useTranslation } from "react-i18next"

const TaskDetail = () => {
    const { t } = useTranslation(null, { keyPrefix: "task" })

    const [_, projectType, color] = useOutletContext()
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
            const deltaArray = task.reminders.map((reminder) => reminder.delta)
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
            newTask={newTask}
            setNewTask={setNewTask}
            projectType={projectType}
            color={color}
        />
    )
}

export default TaskDetail
